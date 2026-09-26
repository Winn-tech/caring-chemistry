import { Role } from "@/generated/prisma/client";
import { z } from "zod";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";
import { createInvitationToken, createPendingPasswordHash, sendStaffInvitation } from "@/lib/staff-invitations";
const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().toLowerCase().email(), role: z.enum([Role.SALES_TEAM, Role.SOCIAL_TEAM]) });
export async function GET(request: Request) { try { await requireRole(request, [Role.GENERAL_ADMIN]); return ok(await prisma.user.findMany({ where: { role: { not: Role.CUSTOMER } }, select: { id: true, name: true, email: true, role: true, isActive: true, invitationAcceptedAt: true, createdAt: true }, orderBy: { createdAt: "desc" } })); } catch (error) { return errorResponse(error); } }
export async function POST(request: Request) { try { const actor = await requireRole(request, [Role.GENERAL_ADMIN]); const input = schema.parse(await request.json()); const invitation = createInvitationToken(); const user = await prisma.$transaction(async (tx) => { const created = await tx.user.create({ data: { ...input, passwordHash: await createPendingPasswordHash(), isActive: false, invitationTokenHash: invitation.tokenHash, invitationExpiresAt: invitation.expiresAt } }); await tx.auditLog.create({ data: { actorId: actor.id, action: "CREATE", entity: "User", entityId: created.id, metadata: { role: created.role, status: "PENDING" } } }); return created; }); await sendStaffInvitation({ email: user.email, name: user.name, token: invitation.token }); await audit(actor.id, "INVITATION_SENT", "User", user.id, request); return ok({ id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive }, 201); } catch (error) { return errorResponse(error); } }
