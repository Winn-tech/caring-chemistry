"use server";

import { revalidatePath } from "next/cache";
import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createInvitationToken, createPendingPasswordHash, sendStaffInvitation, STAFF_ROLES } from "@/lib/staff-invitations";
import { z } from "zod";

export type StaffActionState = { error?: string; success?: string };
const inputSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().toLowerCase().email(), role: z.enum(STAFF_ROLES) });
const idSchema = z.string().cuid();
const refresh = () => revalidatePath("/admin/staff");
const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Unable to complete that staff action.";

export async function createStaff(_: StaffActionState, formData: FormData): Promise<StaffActionState> {
  const actor = await requireAdminPage([Role.GENERAL_ADMIN]);
  const input = inputSchema.safeParse({ name: formData.get("name"), email: formData.get("email"), role: formData.get("role") });
  if (!input.success) return { error: input.error.issues[0]?.message ?? "Review the staff details." };
  const invitation = createInvitationToken();
  try {
    const staff = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: { ...input.data, passwordHash: await createPendingPasswordHash(), isActive: false, invitationTokenHash: invitation.tokenHash, invitationExpiresAt: invitation.expiresAt } });
      await tx.auditLog.create({ data: { actorId: actor.id, action: "CREATE", entity: "User", entityId: user.id, metadata: { role: user.role, status: "PENDING" } } });
      return user;
    });
    await sendStaffInvitation({ email: staff.email, name: staff.name, token: invitation.token });
    await prisma.auditLog.create({ data: { actorId: actor.id, action: "INVITATION_SENT", entity: "User", entityId: staff.id } });
    refresh(); return { success: `Invitation sent to ${staff.email}.` };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") return { error: "An account with that email already exists." };
    refresh(); return { error: errorMessage(error) };
  }
}

export async function updateStaff(_: StaffActionState, formData: FormData): Promise<StaffActionState> {
  const actor = await requireAdminPage([Role.GENERAL_ADMIN]); const id = idSchema.safeParse(formData.get("id")); const input = inputSchema.safeParse({ name: formData.get("name"), email: formData.get("email"), role: formData.get("role") });
  if (!id.success || !input.success) return { error: "Review the staff details." };
  try {
    const target = await prisma.user.findFirst({ where: { id: id.data, role: { in: STAFF_ROLES } }, select: { role: true } });
    if (!target) return { error: "Staff account not found." };
    await prisma.$transaction([prisma.user.update({ where: { id: id.data }, data: input.data }), prisma.auditLog.create({ data: { actorId: actor.id, action: target.role === input.data.role ? "UPDATE" : "CHANGE_ROLE", entity: "User", entityId: id.data, metadata: { previousRole: target.role, role: input.data.role } } })]);
    refresh(); return { success: "Staff account updated." };
  } catch (error) { return { error: errorMessage(error) }; }
}

export async function updateStaffStatus(_: StaffActionState, formData: FormData): Promise<StaffActionState> {
  const actor = await requireAdminPage([Role.GENERAL_ADMIN]); const id = idSchema.safeParse(formData.get("id")); const active = z.enum(["true", "false"]).safeParse(formData.get("isActive"));
  if (!id.success || !active.success) return { error: "Invalid staff account." };
  const target = await prisma.user.findFirst({ where: { id: id.data, role: { in: STAFF_ROLES } }, select: { invitationAcceptedAt: true } });
  if (!target) return { error: "Staff account not found." };
  if (active.data === "true" && !target.invitationAcceptedAt) return { error: "This account must accept its invitation first." };
  await prisma.$transaction([prisma.user.update({ where: { id: id.data }, data: { isActive: active.data === "true" } }), prisma.auditLog.create({ data: { actorId: actor.id, action: active.data === "true" ? "ACTIVATE_STAFF" : "DEACTIVATE_STAFF", entity: "User", entityId: id.data } })]);
  refresh(); return { success: active.data === "true" ? "Staff account activated." : "Staff account deactivated." };
}

export async function resendStaffInvitation(_: StaffActionState, formData: FormData): Promise<StaffActionState> {
  const actor = await requireAdminPage([Role.GENERAL_ADMIN]); const id = idSchema.safeParse(formData.get("id")); if (!id.success) return { error: "Invalid staff account." };
  const staff = await prisma.user.findFirst({ where: { id: id.data, role: { in: STAFF_ROLES }, invitationAcceptedAt: null }, select: { id: true, name: true, email: true } });
  if (!staff) return { error: "Only pending accounts can receive a new invitation." };
  const invitation = createInvitationToken();
  try {
    await prisma.user.update({ where: { id: staff.id }, data: { invitationTokenHash: invitation.tokenHash, invitationExpiresAt: invitation.expiresAt, isActive: false } });
    await sendStaffInvitation({ ...staff, token: invitation.token });
    await prisma.auditLog.create({ data: { actorId: actor.id, action: "INVITATION_RESENT", entity: "User", entityId: staff.id } });
    refresh(); return { success: `Invitation resent to ${staff.email}.` };
  } catch (error) { return { error: errorMessage(error) }; }
}

export async function deleteStaff(_: StaffActionState, formData: FormData): Promise<StaffActionState> {
  const actor = await requireAdminPage([Role.GENERAL_ADMIN]);
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid staff account." };
  try {
    const target = await prisma.user.findFirst({ where: { id: id.data, role: { in: STAFF_ROLES } }, select: { id: true } });
    if (!target) return { error: "Staff account not found." };
    await prisma.$transaction([
      prisma.user.delete({ where: { id: id.data } }),
      prisma.auditLog.create({ data: { actorId: actor.id, action: "DELETE_STAFF", entity: "User", entityId: id.data } }),
    ]);
    refresh();
    return { success: "Staff account deleted." };
  } catch (error) { return { error: errorMessage(error) }; }
}
