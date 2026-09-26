import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@/generated/prisma/client";

const productParamSchema = z.object({ productId: z.string().cuid() });

export async function GET(request: Request, { params }: { params: Promise<{ productId: string }> }) {
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

    const query = new URL(request.url).searchParams;
    const country = query.get("country")?.trim();
    const state = query.get("state")?.trim();
    const city = query.get("city")?.trim();

    const stores = await prisma.store.findMany({
      where: {
        isActive: true,
        ...(country ? { country: { equals: country, mode: "insensitive" } } : {}),
        ...(state ? { state: { equals: state, mode: "insensitive" } } : {}),
        ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
      },
      orderBy: [{ country: "asc" }, { state: "asc" }, { city: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        country: true,
        phone: true,
        email: true,
        latitude: true,
        longitude: true,
        openingHours: true,
        isActive: true,
      },
    });

    return NextResponse.json({ stores }, { status: 200, headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } });
  } catch (error) {
    console.error("Store listing failed:", error);
    return NextResponse.json({ error: "Unable to load stores." }, { status: 500 });
  }
}
