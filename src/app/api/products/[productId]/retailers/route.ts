import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@/generated/prisma/client";
import { isSafeExternalUrl } from "@/lib/where-to-buy";

const productParamSchema = z.object({ productId: z.string().cuid() });

export async function GET(_: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    const parsed = productParamSchema.safeParse({ productId });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product identifier." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId, status: ProductStatus.ACTIVE, deletedAt: null },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const retailers = await prisma.productRetailer.findMany({
      where: {
        productId: parsed.data.productId,
        isAvailable: true,
        retailer: { isActive: true },
      },
      include: { retailer: true },
      orderBy: [{ retailer: { priority: "asc" } }, { retailer: { name: "asc" } }],
    });

    const safeRetailers = retailers
      .filter((entry) => isSafeExternalUrl(entry.externalProductUrl))
      .map((entry) => ({
        id: entry.id,
        retailerId: entry.retailerId,
        name: entry.retailer.name,
        type: entry.retailer.type,
        url: entry.externalProductUrl,
        priority: entry.retailer.priority,
      }));

    return NextResponse.json({ retailers: safeRetailers }, { status: 200, headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } });
  } catch (error) {
    console.error("Retailer resolution failed:", error);
    return NextResponse.json({ error: "Unable to resolve retailer options." }, { status: 500 });
  }
}
