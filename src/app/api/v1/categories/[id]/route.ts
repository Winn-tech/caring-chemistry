import { Role } from "@/generated/prisma/client";
import { z } from "zod";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";
const schema = z.object({ name: z.string().min(2).max(80).optional(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]); const { id } = await params; const category = await prisma.category.update({ where: { id }, data: schema.parse(await request.json()) }); await audit(user.id, "CATEGORY_UPDATED", "Category", id, request); return ok(category); } catch (error) { return errorResponse(error); } }
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]); const { id } = await params; await prisma.category.delete({ where: { id } }); await audit(user.id, "CATEGORY_DELETED", "Category", id, request); return new Response(null, { status: 204 }); } catch (error) { return errorResponse(error); } }
