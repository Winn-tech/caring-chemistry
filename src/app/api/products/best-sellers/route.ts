import { NextResponse } from "next/server";
import { ProductStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      deletedAt: null,
      isBestSeller: true,
    },
    orderBy: [{ isBestSeller: "desc" }, { createdAt: "desc" }],
    take: 12,
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
    },
  });

  return NextResponse.json(
    products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      currency: product.currency,
      badge: product.badge,
      rating: product.rating ? Number(product.rating) : null,
      reviewCount: product.reviewCount,
      imageUrl: product.images[0]?.url ?? null,
      imageAlt: product.images[0]?.alt ?? product.name,
    }))
  );
}