import { SignJWT, jwtVerify } from "jose";
import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "");
export type AuthUser = { id: string; email: string; role: Role; name: string };
export async function signToken(user: AuthUser) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new ApiError(500, "JWT_SECRET must be set to a 32+ character secret.");
  return new SignJWT({ email: user.email, role: user.role, name: user.name }).setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setIssuedAt().setExpirationTime("8h").sign(secret());
}
export async function requireAuth(request: Request): Promise<AuthUser> {
  const value = request.headers.get("authorization");
  if (!value?.startsWith("Bearer ")) throw new ApiError(401, "Bearer token required.");
  try {
    const { payload } = await jwtVerify(value.slice(7), secret());
    if (!payload.sub) throw new Error("No subject");
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, name: true, role: true, isActive: true } });
    if (!user || !user.isActive) throw new ApiError(401, "Account is unavailable.");
    return user;
  } catch (error) { if (error instanceof ApiError) throw error; throw new ApiError(401, "Invalid or expired token."); }
}
export async function requireRole(request: Request, allowed: Role[]) {
  const user = await requireAuth(request);
  if (!allowed.includes(user.role)) throw new ApiError(403, "You do not have permission for this action.");
  return user;
}
