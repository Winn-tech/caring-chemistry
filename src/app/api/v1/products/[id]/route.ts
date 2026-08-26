import { ProductStatus, Role } from "@/generated/prisma/client";
import { z } from "zod";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";
const schema = z.object({ name: z.string().min(2).max(160).optional(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(), description: z.string().max(8000).nullable().optional(), price: z.number().positive().max(99999999).optional(), currency: z.string().length(3).optional(), stock: z.number().int().min(0).optional(), status: z.nativeEnum(ProductStatus).optional(), categoryId: z.string().cuid().optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]); const { id } = await params; const product = await prisma.product.update({ where: { id, deletedAt: null }, data: schema.parse(await request.json()), include: { category: true, images: true } }); await audit(user.id, "PRODUCT_UPDATED", "Product", id, request); return ok(product); } catch (error) { return errorResponse(error); } }
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]); const { id } = await params; await prisma.product.update({ where: { id, deletedAt: null }, data: { deletedAt: new Date(), status: ProductStatus.ARCHIVED } }); await audit(user.id, "PRODUCT_ARCHIVED", "Product", id, request); return new Response(null, { status: 204 }); } catch (error) { return errorResponse(error); } }
