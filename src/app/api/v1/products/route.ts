import { ProductBadge, ProductStatus, Role } from "@/generated/prisma/client";
import { z } from "zod";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";

const image = z.object({
  url: z.string().url(),
  publicId: z.string().max(255).optional(),
  alt: z.string().max(150).optional(),
  position: z.number().int().min(0).optional(),
});

const schema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(8000).optional(),
  price: z.number().positive().max(99999999),
  compareAtPrice: z.number().positive().max(99999999).optional(),
  currency: z.string().length(3).default("NGN"),
  stock: z.number().int().min(0),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  badge: z.nativeEnum(ProductBadge).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).default(0),
  isBestSeller: z.boolean().default(false),
  categoryId: z.string().cuid(),
  images: z.array(image).max(10).optional(),
}).refine((value) => value.compareAtPrice === undefined || value.compareAtPrice >= value.price, {
  message: "Compare-at price must be at least the selling price.",
  path: ["compareAtPrice"],
});

export async function GET(request: Request) {
  try {
    await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]);

    const q = new URL(request.url).searchParams;
    const status = q.get("status") as ProductStatus | null;
    const bestSellerParam = q.get("isBestSeller");

    return ok(
      await prisma.product.findMany({
        where: {
          deletedAt: null,
          ...(status ? { status } : {}),
          ...(bestSellerParam !== null
            ? { isBestSeller: bestSellerParam === "true" }
            : {}),
        },
        include: {
          category: true,
          images: { orderBy: { position: "asc" } },
        },
        orderBy: { updatedAt: "desc" },
      })
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]);
    const input = schema.parse(await request.json());

    const product = await prisma.product.create({
      data: {
        ...input,
        images: input.images ? { create: input.images } : undefined,
      },
      include: { category: true, images: true },
    });

    await audit(user.id, "PRODUCT_CREATED", "Product", product.id, request);

    return ok(product, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
