import { Role } from "@/generated/prisma/client";
import { z } from "zod";
import { errorResponse, ok, ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";
const schema = z.object({ role: z.enum([Role.GENERAL_ADMIN, Role.SALES_TEAM, Role.SOCIAL_TEAM]).optional(), isActive: z.boolean().optional() }).refine((value) => value.role !== undefined || value.isActive !== undefined);
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const actor = await requireRole(request, [Role.GENERAL_ADMIN]); const { id } = await params; const input = schema.parse(await request.json()); if (actor.id === id && input.isActive === false) throw new ApiError(422, "You cannot deactivate your own account."); const user = await prisma.user.update({ where: { id }, data: input, select: { id: true, name: true, email: true, role: true, isActive: true } }); await audit(actor.id, "STAFF_UPDATED", "User", id, request, input); return ok(user); } catch (error) { return errorResponse(error); } }
