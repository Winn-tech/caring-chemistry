import bcrypt from "bcryptjs";
import { z } from "zod";
import { ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { auditServer, rateLimit } from "@/lib/security";

/** Same minimum as staff invitations and the password API. */
export const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password.").max(MAX_PASSWORD_LENGTH),
    newPassword: z.string().min(MIN_PASSWORD_LENGTH, `Your new password must be at least ${MIN_PASSWORD_LENGTH} characters.`).max(MAX_PASSWORD_LENGTH, `Your new password must be at most ${MAX_PASSWORD_LENGTH} characters.`),
    confirmPassword: z.string().min(1, "Confirm your new password.").max(MAX_PASSWORD_LENGTH),
  })
  .refine((input) => input.newPassword === input.confirmPassword, { message: "The new passwords don't match.", path: ["confirmPassword"] })
  .refine((input) => input.newPassword !== input.currentPassword, { message: "Choose a new password that is different from your current one.", path: ["newPassword"] });

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type PasswordChangeResult = { ok: true } | { ok: false; error: string };

/**
 * Changes a signed-in admin's password.
 *
 * - Rate limited per account (5 attempts per 15 minutes, shared with the password API), and the
 *   attempt is counted before the current password is checked, so it can't be used to guess it.
 * - Requires the correct current password; the account must still be active.
 * - Saving the new hash updates the account, which ends every session issued before the change
 *   (see authenticateToken in lib/auth). The caller issues a fresh session for this browser.
 */
export async function changeAdminPassword(userId: string, input: PasswordChangeInput): Promise<PasswordChangeResult> {
  try {
    await rateLimit(`password-change:${userId}`, 5, 15 * 60 * 1000);
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) return { ok: false, error: "Too many attempts. Please wait 15 minutes and try again." };
    throw error;
  }

  const account = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true, isActive: true } });
  if (!account || !account.isActive) return { ok: false, error: "Your account is unavailable." };
  if (!(await bcrypt.compare(input.currentPassword, account.passwordHash))) return { ok: false, error: "Your current password is incorrect." };

  await prisma.user.update({ where: { id: userId }, data: { passwordHash: await bcrypt.hash(input.newPassword, 12) } });
  await auditServer(userId, "PASSWORD_CHANGED", "User", userId, { via: "admin settings" });
  return { ok: true };
}
