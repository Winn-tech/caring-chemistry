"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductBadge, ProductStatus, Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { externalUrlSchema } from "@/lib/where-to-buy";
import { deleteProductImage } from "@/lib/cloudinary";
import { z } from "zod";

export type ProductFormState = { error?: string };

const optionalText = (max: number) => z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().max(max).optional());
const optionalNumber = z.preprocess((value) => value === "" || value === null ? undefined : value, z.coerce.number().positive().max(99_999_999).optional());
const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: optionalText(8_000),
  price: z.coerce.number().positive().max(99_999_999),
  compareAtPrice: optionalNumber,
  stock: z.coerce.number().int().min(0).max(1_000_000),
  categoryId: z.string().cuid(),
  status: z.enum([ProductStatus.DRAFT, ProductStatus.ACTIVE]),
  badge: z.preprocess((value) => value === "" ? undefined : value, z.nativeEnum(ProductBadge).optional()),
  isBestSeller: z.boolean(),
  imageUrl: z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().url().max(2_000).optional()),
  imagePublicId: z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().max(500).optional()),
}).refine((value) => value.compareAtPrice === undefined || value.compareAtPrice >= value.price, {
  message: "Compare-at price must be at least the selling price.",
  path: ["compareAtPrice"],
});

const retailerLinkSchema = z.object({
  retailerId: z.string().cuid(),
  url: externalUrlSchema,
  isAvailable: z.boolean(),
});

function readProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"), slug: formData.get("slug"), description: formData.get("description"),
    price: formData.get("price"), compareAtPrice: formData.get("compareAtPrice"), stock: formData.get("stock"),
    categoryId: formData.get("categoryId"), status: formData.get("status"), badge: formData.get("badge"), isBestSeller: formData.get("isBestSeller") === "on", imageUrl: formData.get("imageUrl"), imagePublicId: formData.get("imagePublicId"),
  });
}

function readRetailerLinks(formData: FormData) {
  const retailerIds = formData.getAll("retailerId");
  const links = retailerIds.map((retailerId) => retailerLinkSchema.safeParse({
    retailerId,
    url: formData.get(`retailerUrl:${String(retailerId)}`),
    isAvailable: formData.get(`retailerAvailable:${String(retailerId)}`) === "on",
  })).filter((result): result is { success: true; data: { retailerId: string; url: string; isAvailable: boolean } } => result.success && result.data.url.length > 0).map((result) => result.data);
  const invalid = retailerIds.some((retailerId) => {
    const url = formData.get(`retailerUrl:${String(retailerId)}`);
    return url !== null && url !== "" && !retailerLinkSchema.safeParse({ retailerId, url, isAvailable: true }).success;
  });
  return invalid ? { error: "Enter a valid http or https retailer URL." } : { links };
}

async function validateRetailerLinks(links: Array<{ retailerId: string }>) {
  const retailerIds = [...new Set(links.map((link) => link.retailerId))];
  if (retailerIds.length === 0) return true;
  const activeCount = await prisma.retailer.count({ where: { id: { in: retailerIds }, isActive: true } });
  return activeCount === retailerIds.length;
}

async function saveRetailerLinks(tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], productId: string, links: Array<{ retailerId: string; url: string; isAvailable: boolean }>) {
  await tx.productRetailer.deleteMany({ where: { productId } });
  if (links.length) await tx.productRetailer.createMany({ data: links.map((link) => ({ productId, retailerId: link.retailerId, externalProductUrl: link.url, isAvailable: link.isAvailable })) });
}

function validationMessage(result: ReturnType<typeof readProductForm>) {
  if (result.success) return undefined;
  return result.error.issues[0]?.message ?? "Please review the product details.";
}

export async function createProduct(_: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const result = readProductForm(formData);
  const error = validationMessage(result);
  if (error || !result.success) return { error };
  const { imageUrl, imagePublicId, ...productData } = result.data;
  const retailerLinks = readRetailerLinks(formData);
  if ("error" in retailerLinks) return { error: retailerLinks.error };
  if (!(await validateRetailerLinks(retailerLinks.links))) return { error: "One or more selected retailers are no longer active." };

  try {
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({ data: { ...productData, images: imageUrl ? { create: { url: imageUrl, publicId: imagePublicId, position: 0 } } : undefined } });
      await saveRetailerLinks(tx, created.id, retailerLinks.links);
      return created;
    });
    await auditServer(user.id, "PRODUCT_CREATED", "Product", product.id, { status: product.status });
  } catch (cause) {
    if (isUniqueError(cause)) return { error: "A product with this slug already exists." };
    throw cause;
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(_: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const id = formData.get("id");
  if (typeof id !== "string" || !z.string().cuid().safeParse(id).success) return { error: "Invalid product." };
  const result = readProductForm(formData);
  const error = validationMessage(result);
  if (error || !result.success) return { error };
  const { imageUrl, imagePublicId, ...productData } = result.data;
  const retailerLinks = readRetailerLinks(formData);
  if ("error" in retailerLinks) return { error: retailerLinks.error };
  if (!(await validateRetailerLinks(retailerLinks.links))) return { error: "One or more selected retailers are no longer active." };

  let replacedPublicId: string | null = null;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id, deletedAt: null }, data: productData });

      // The editor manages only the main image; any further gallery images are left untouched.
      const primary = await tx.productImage.findFirst({ where: { productId: id }, orderBy: { position: "asc" } });
      if (imageUrl && primary?.url !== imageUrl) {
        if (primary) await tx.productImage.update({ where: { id: primary.id }, data: { url: imageUrl, publicId: imagePublicId ?? null } });
        else await tx.productImage.create({ data: { productId: id, url: imageUrl, publicId: imagePublicId, position: 0 } });
        replacedPublicId = primary?.publicId ?? null;
      } else if (!imageUrl && primary) {
        await tx.productImage.delete({ where: { id: primary.id } });
        replacedPublicId = primary.publicId;
      }

      await saveRetailerLinks(tx, id, retailerLinks.links);
    });
    await auditServer(user.id, "PRODUCT_UPDATED", "Product", id, { status: result.data.status });
  } catch (cause) {
    if (isUniqueError(cause)) return { error: "A product with this slug already exists." };
    return { error: "The product could not be updated. It may have been archived." };
  }

  // Remove the replaced file from Cloudinary only after the database change has committed.
  if (replacedPublicId) await deleteProductImage(replacedPublicId);

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function archiveProduct(formData: FormData) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const id = formData.get("id");
  if (typeof id !== "string" || !z.string().cuid().safeParse(id).success) return;

  const product = await prisma.product.update({ where: { id, deletedAt: null }, data: { deletedAt: new Date(), status: ProductStatus.ARCHIVED } });
  await auditServer(user.id, "PRODUCT_ARCHIVED", "Product", id, { previousStatus: product.status });
  revalidatePath("/admin/products");
}

function isUniqueError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}
