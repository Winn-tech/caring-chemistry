import bcrypt from "bcryptjs";
import { z } from "zod";
import { errorResponse, ok, ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { audit, clientIp, rateLimit } from "@/lib/security";

const schema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(12).max(128),
  confirmPassword: z.string().min(1).max(128),
}).refine((input) => input.newPassword === input.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth(request);
    await rateLimit(`password-change:${user.id}:${clientIp(request)}`, 5, 15 * 60 * 1000);
    const input = schema.parse(await request.json());
    const account = await prisma.user.findUnique({ where: { id: user.id } });

    if (!account || !(await bcrypt.compare(input.currentPassword, account.passwordHash))) {
      throw new ApiError(401, "Current password is incorrect.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(input.newPassword, 12) },
    });
    await audit(user.id, "PASSWORD_CHANGED", "User", user.id, request);
    return ok({ message: "Password changed successfully." });
  } catch (error) { return errorResponse(error); }
}