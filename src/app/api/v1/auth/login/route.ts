import bcrypt from "bcryptjs";
import { z } from "zod";
import { errorResponse, ok, ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { adminSessionCookie, signToken } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/security";

const WINDOW_MS = 15 * 60 * 1000;
const schema = z.object({ email: z.string().trim().toLowerCase().email().max(320), password: z.string().min(1).max(128) });

// Compared against when the email is unknown, so a wrong email takes as long as a wrong
// password and response times do not reveal which emails have accounts.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= bcrypt.hash("caring-chemistry-timing-equaliser", 12));

export async function POST(request: Request) {
  try {
    await rateLimit(`login:${clientIp(request)}`, 5, WINDOW_MS);
    const input = schema.parse(await request.json());
    // Per-account limit as well, so rotating IP addresses cannot be used to guess one account's password.
    await rateLimit(`login-account:${input.email}`, 10, WINDOW_MS);

    const user = await prisma.user.findUnique({ where: { email: input.email } });
    const passwordMatches = await bcrypt.compare(input.password, user?.passwordHash ?? (await getDummyHash()));
    if (!user || !user.isActive || !passwordMatches) throw new ApiError(401, "Invalid email or password.");

    const token = await signToken(user);
    const profile = { id: user.id, name: user.name, email: user.email, role: user.role };
    // The browser admin form asks for cookie-only sessions, so page scripts never see the token.
    // API clients (e.g. the Postman collection) still receive it for Bearer authentication.
    const cookieOnly = request.headers.get("x-session-mode") === "cookie";
    const response = ok(cookieOnly ? { user: profile } : { token, user: profile });
    response.cookies.set(adminSessionCookie(token));
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
