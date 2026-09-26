import { NextResponse } from "next/server";
import { ProductStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { isSafeExternalUrl } from "@/lib/where-to-buy";

// Link previews and crawlers follow links too; they should not count as buyers.
const BOT_USER_AGENT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless/i;

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

/** Records a "Buy on <retailer>" click, then sends the customer to the retailer. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string; retailerId: string }> }
) {
  const { productId, retailerId } = await params;

  const link = await prisma.productRetailer.findUnique({
    where: { productId_retailerId: { productId, retailerId } },
    select: {
      externalProductUrl: true,
      isAvailable: true,
      retailer: { select: { isActive: true } },
      product: { select: { slug: true, status: true, deletedAt: true } },
    },
  });

  const productIsLive = link?.product.status === ProductStatus.ACTIVE && !link.product.deletedAt;
  const linkIsLive =
    link && productIsLive && link.isAvailable && link.retailer.isActive && isSafeExternalUrl(link.externalProductUrl);

  // A stale button (link removed or marked unavailable since the page loaded)
  // goes back to the product page, which shows the in-store fallback.
  if (!linkIsLive) {
    const fallback = productIsLive ? `/product/${link!.product.slug}` : "/shop";
    return NextResponse.redirect(new URL(fallback, request.url), { status: 302, headers: NO_STORE });
  }

  if (!BOT_USER_AGENT.test(request.headers.get("user-agent") ?? "")) {
    try {
      await prisma.retailerClick.create({ data: { productId, retailerId } });
    } catch (error) {
      // Never block the customer's purchase because tracking failed.
      console.error("Failed to record retailer click", error);
    }
  }

  return NextResponse.redirect(link.externalProductUrl.trim(), { status: 302, headers: NO_STORE });
}
