import Link from "next/link";
import { notFound } from "next/navigation";
import { Role } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../../components/admin-shell";
import { ProductEditor } from "../components/product-editor";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const { id } = await params;
  const [product, categories, retailers] = await Promise.all([prisma.product.findFirst({ where: { id, deletedAt: null }, include: { images: { orderBy: { position: "asc" } }, retailers: { select: { retailerId: true, externalProductUrl: true, isAvailable: true } } } }), prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }), prisma.retailer.findMany({ where: { isActive: true }, select: { id: true, name: true, country: true }, orderBy: [{ priority: "asc" }, { name: "asc" }] })]);
  if (!product) notFound();
  // Only plain fields go to the client editor (Prisma Decimal values such as price cannot be passed to it).
  const editorProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    categoryId: product.categoryId,
    status: product.status,
    badge: product.badge,
    isBestSeller: product.isBestSeller,
    images: product.images.map((image) => ({ url: image.url, publicId: image.publicId })),
    retailers: product.retailers,
  };
  return <AdminShell user={user}><Link className="text-sm font-medium text-primary-600 hover:text-primary-950" href="/admin/products">← Back to products</Link><h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">Edit product</h1><p className="mt-2 text-sm text-primary-600">Changes are validated and recorded in the admin audit log.</p><ProductEditor categories={categories} retailers={retailers} product={editorProduct} /></AdminShell>;
}
