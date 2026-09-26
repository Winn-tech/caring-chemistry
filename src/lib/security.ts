import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";

export function clientIp(request: Request) { return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"; }
export async function rateLimit(key: string, limit: number, windowMs: number) {
  const since = new Date(Date.now() - windowMs);
  await prisma.rateLimitEvent.deleteMany({ where: { key, createdAt: { lt: since } } });
  const count = await prisma.rateLimitEvent.count({ where: { key, createdAt: { gte: since } } });
  if (count >= limit) throw new ApiError(429, "Too many requests. Please try again later.");
  await prisma.rateLimitEvent.create({ data: { key } });
}
export async function audit(actorId: string | undefined, action: string, entity: string, entityId: string, request: Request, metadata?: object) {
  await prisma.auditLog.create({ data: { actorId, action, entity, entityId, metadata, ipAddress: clientIp(request) } });
}

/** For authenticated server actions, where there is no request object to inspect. */
export async function auditServer(actorId: string, action: string, entity: string, entityId: string, metadata?: object) {
  await prisma.auditLog.create({ data: { actorId, action, entity, entityId, metadata } });
}
