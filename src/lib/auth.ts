import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";

/**
 * Used for both signing and verifying. Refusing a missing or short secret on verify matters:
 * verifying against an empty key would let anyone forge a session.
 */
function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new ApiError(500, "JWT_SECRET must be set to a 32+ character secret.");
  return new TextEncoder().encode(value);
}
export type AuthUser = { id: string; email: string; role: Role; name: string };

export const ADMIN_SESSION_COOKIE = "cc_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
export const ADMIN_ROLES = [Role.GENERAL_ADMIN, Role.SALES_TEAM, Role.SOCIAL_TEAM] as const;

async function authenticateToken(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
  if (!payload.sub || !payload.iat) throw new Error("Incomplete token");

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true, isActive: true, updatedAt: true },
  });

  if (!user || !user.isActive) throw new ApiError(401, "Account is unavailable.");
  // Any change to the account (password, role, status, details) ends sessions issued before it.
  // iat is whole seconds, so allow up to one second of rounding.
  if (user.updatedAt.getTime() > (payload.iat + 1) * 1000) throw new ApiError(401, "Your session has ended. Please sign in again.");
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
export async function signToken(user: AuthUser) {
  return new SignJWT({ email: user.email, role: user.role, name: user.name }).setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setIssuedAt().setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`).sign(secret());
}

/** The httpOnly cookie the browser admin area uses. Shared by login and password change. */
export function adminSessionCookie(token: string) {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: "/admin",
  };
}
export async function requireAuth(request: Request): Promise<AuthUser> {
  const value = request.headers.get("authorization");
  if (!value?.startsWith("Bearer ")) throw new ApiError(401, "Bearer token required.");
  try {
    return await authenticateToken(value.slice(7));
  } catch (error) { if (error instanceof ApiError) throw error; throw new ApiError(401, "Invalid or expired token."); }
}
export async function requireRole(request: Request, allowed: Role[]) {
  const user = await requireAuth(request);
  if (!allowed.includes(user.role)) throw new ApiError(403, "You do not have permission for this action.");
  return user;
}

/** Server-component guard for the browser admin area. API routes continue to require Bearer tokens. */
export async function getAdminSession(): Promise<AuthUser | null> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const user = await authenticateToken(token);
    return user.role === Role.GENERAL_ADMIN || user.role === Role.SALES_TEAM || user.role === Role.SOCIAL_TEAM ? user : null;
  } catch {
    return null;
  }
}

export async function requireAdminPage(allowed: readonly Role[] = ADMIN_ROLES): Promise<AuthUser> {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  if (!allowed.includes(user.role)) redirect("/admin");
  return user;
}
