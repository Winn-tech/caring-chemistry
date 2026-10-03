import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";

/**
 * The client's IP, for rate limiting and audit logs.
 *
 * The first X-Forwarded-For entry is whatever the client sent, so it can be forged to dodge
 * rate limits. Instead: if TRUSTED_IP_HEADER names a header your host sets and overwrites
 * (e.g. "x-vercel-forwarded-for" on Vercel, "cf-connecting-ip" behind Cloudflare), use it;
 * otherwise use the last X-Forwarded-For entry, which is the one added by your own proxy.
 */
export function clientIp(request: Request) {
  const trustedHeader = process.env.TRUSTED_IP_HEADER?.trim().toLowerCase();
  const trusted = trustedHeader ? request.headers.get(trustedHeader)?.split(",")[0]?.trim() : undefined;
  if (trusted) return trusted;
  const hops = request.headers.get("x-forwarded-for")?.split(",").map((hop) => hop.trim()).filter(Boolean);
  return hops?.at(-1) || "unknown";
}

/**
 * Allows `limit` events per `key` within `windowMs`. The event is recorded before counting, so
 * concurrent requests all see each other and a burst cannot slip past the limit.
 */
export async function rateLimit(key: string, limit: number, windowMs: number) {
  const since = new Date(Date.now() - windowMs);
  await prisma.rateLimitEvent.deleteMany({ where: { key, createdAt: { lt: since } } });
  await prisma.rateLimitEvent.create({ data: { key } });
  const count = await prisma.rateLimitEvent.count({ where: { key, createdAt: { gte: since } } });
  if (count > limit) throw new ApiError(429, "Too many requests. Please try again later.");
}
export async function audit(actorId: string | undefined, action: string, entity: string, entityId: string, request: Request, metadata?: object) {
  await prisma.auditLog.create({ data: { actorId, action, entity, entityId, metadata, ipAddress: clientIp(request) } });
}

/** For authenticated server actions, where there is no request object to inspect. */
export async function auditServer(actorId: string, action: string, entity: string, entityId: string, metadata?: object) {
  await prisma.auditLog.create({ data: { actorId, action, entity, entityId, metadata } });
}
