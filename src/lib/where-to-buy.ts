import { ProductStatus } from "@/generated/prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const externalUrlSchema = z.string().trim().refine((value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}, "Enter a valid http or https URL.");

export function isSafeExternalUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value.trim());
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

/** The tracked "Buy on <retailer>" link; see app/go/[productId]/[retailerId]/route.ts. */
export function retailerClickPath(productId: string, retailerId: string) {
  return `/go/${encodeURIComponent(productId)}/${encodeURIComponent(retailerId)}`;
}

export async function getActiveProductRetailers(productId: string) {
  return prisma.productRetailer.findMany({
    where: {
      productId,
      isAvailable: true,
      retailer: { isActive: true },
      product: { status: ProductStatus.ACTIVE, deletedAt: null },
    },
    include: { retailer: true },
    orderBy: [{ retailer: { priority: "asc" } }, { retailer: { name: "asc" } }],
  });
}

export async function getActiveStores(filters?: { country?: string; state?: string; city?: string }) {
  const country = filters?.country?.trim();
  const state = filters?.state?.trim();
  const city = filters?.city?.trim();

  return prisma.store.findMany({
    where: {
      isActive: true,
      ...(country ? { country: { equals: country, mode: "insensitive" } } : {}),
      ...(state ? { state: { equals: state, mode: "insensitive" } } : {}),
      ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
    },
    orderBy: [{ country: "asc" }, { state: "asc" }, { city: "asc" }, { name: "asc" }],
  });
}
