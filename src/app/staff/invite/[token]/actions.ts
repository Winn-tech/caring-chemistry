"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashInvitationToken } from "@/lib/staff-invitations";

export type InvitationActionState = { error?: string; success?: boolean };

const schema = z.object({
  token: z.string().min(40).max(100),
  password: z.string().min(12).max(128),
  confirmPassword: z.string().min(12).max(128),
}).refine((input) => input.password === input.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export async function acceptInvitation(_: InvitationActionState, formData: FormData): Promise<InvitationActionState> {
  const input = schema.safeParse({ token: formData.get("token"), password: formData.get("password"), confirmPassword: formData.get("confirmPassword") });
  if (!input.success) return { error: input.error.issues[0]?.message ?? "Review your password." };

  const passwordHash = await bcrypt.hash(input.data.password, 12);
  try {
    await prisma.$transaction(async (tx) => {
      const tokenHash = hashInvitationToken(input.data.token);
      const account = await tx.user.findFirst({ where: { invitationTokenHash: tokenHash, invitationExpiresAt: { gt: new Date() }, invitationAcceptedAt: null, role: { in: ["SALES_TEAM", "SOCIAL_TEAM"] } }, select: { id: true } });
      if (!account) throw new Error("This invitation is invalid, expired, or has already been used.");
      const claimed = await tx.user.updateMany({ where: { id: account.id, invitationTokenHash: tokenHash, invitationAcceptedAt: null, invitationExpiresAt: { gt: new Date() } }, data: { passwordHash, isActive: true, invitationTokenHash: null, invitationExpiresAt: null, invitationAcceptedAt: new Date() } });
      if (claimed.count !== 1) throw new Error("This invitation is invalid, expired, or has already been used.");
      await tx.auditLog.create({ data: { action: "INVITATION_ACCEPTED", entity: "User", entityId: account.id } });
    });
    return { success: true };
  } catch (error) { return { error: error instanceof Error ? error.message : "Unable to activate your account." }; }
}
