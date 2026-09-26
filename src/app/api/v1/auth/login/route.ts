import bcrypt from "bcryptjs";
import { z } from "zod";
import { errorResponse, ok, ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/security";

const schema = z.object({ email: z.string().email(), password: z.string().min(1).max(128) });
export async function POST(request: Request) { try {
  await rateLimit(`login:${clientIp(request)}`, 5, 15 * 60 * 1000);
  const input = schema.parse(await request.json());
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user || !user.isActive || !(await bcrypt.compare(input.password, user.passwordHash))) throw new ApiError(401, "Invalid email or password.");
  const token = await signToken(user);
  const response = ok({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/admin",
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
} catch (error) { return errorResponse(error); } }
