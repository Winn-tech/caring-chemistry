import { Role } from "@/generated/prisma/client";
import { z } from "zod";
import { errorResponse, ok, ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
const schema = z.object({ role: z.enum([Role.SALES_TEAM, Role.SOCIAL_TEAM]).optional(), isActive: z.boolean().optional() }).refine((value) => value.role !== undefined || value.isActive !== undefined);
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
     try { const actor = await requireRole(request, [Role.GENERAL_ADMIN]); 
        const { id } = await params; const input = schema.parse(await request.json()); 
        const target = await prisma.user.findUnique({ where: { id }, select: { role: true, invitationAcceptedAt: true } }); 
        if (input.isActive === true && !target.invitationAcceptedAt) throw new ApiError(400, "This account must accept its invitation first."); 
        const action = input.role && input.role !== target.role ? "CHANGE_ROLE" : input.isActive === true ? "ACTIVATE_STAFF" : input.isActive === false ? "DEACTIVATE_STAFF" : "UPDATE";
        const user = await prisma.$transaction(async (tx) => { const updated = await tx.user.update({ where: { id }, data: input, select: { id: true, name: true, email: true, role: true, isActive: true } }); 
        await tx.auditLog.create({ data: { actorId: actor.id, action, entity: "User", entityId: id, metadata: input } }); return updated; }); 
        return ok(user); } catch (error) { return errorResponse(error); 
            
        } }

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const actor = await requireRole(request, [Role.GENERAL_ADMIN]); const { id } = await params; const target = await prisma.user.findUnique({ where: { id }, select: { role: true } }); if (!target || ![Role.SALES_TEAM, Role.SOCIAL_TEAM].includes(target.role)) throw new ApiError(404, "Staff account not found."); await prisma.$transaction(async (tx) => { await tx.user.delete({ where: { id } }); await tx.auditLog.create({ data: { actorId: actor.id, action: "DELETE_STAFF", entity: "User", entityId: id } }); }); return ok({ deleted: true }); } catch (error) { return errorResponse(error); } }
