import { ProductBadge, ProductStatus, Role } from "@/generated/prisma/client";
import { z } from "zod";
import { ApiError, errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";

// Mirrors the admin product editor, so the API can change everything the screen can.
const schema = z.object({
  name: z.string().min(2).max(160).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(8000).nullable().optional(),
  price: z.number().positive().max(99999999).optional(),
  compareAtPrice: z.number().positive().max(99999999).nullable().optional(),
  currency: z.string().length(3).optional(),
  stock: z.number().int().min(0).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  badge: z.nativeEnum(ProductBadge).nullable().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
  reviewCount: z.number().int().min(0).optional(),
  isBestSeller: z.boolean().optional(),
  categoryId: z.string().cuid().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]);
    const { id } = await params;
    const input = schema.parse(await request.json());

    if (input.price !== undefined || (input.compareAtPrice !== undefined && input.compareAtPrice !== null)) {
      const current = await prisma.product.findFirst({ where: { id, deletedAt: null }, select: { price: true, compareAtPrice: true } });
      if (!current) throw new ApiError(404, "Product not found.");
      const price = input.price ?? Number(current.price);
      const compareAtPrice = input.compareAtPrice !== undefined ? input.compareAtPrice : current.compareAtPrice === null ? null : Number(current.compareAtPrice);
      if (compareAtPrice !== null && compareAtPrice < price) throw new ApiError(422, "Compare-at price must be at least the selling price.");
    }

    const product = await prisma.product.update({ where: { id, deletedAt: null }, data: input, include: { category: true, images: true } });
    await audit(user.id, "PRODUCT_UPDATED", "Product", id, request);
    return ok(product);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]);
    const { id } = await params;
    await prisma.product.update({ where: { id, deletedAt: null }, data: { deletedAt: new Date(), status: ProductStatus.ARCHIVED } });
    await audit(user.id, "PRODUCT_ARCHIVED", "Product", id, request);
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
