import Link from "next/link";
import { Role } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../../components/admin-shell";
import { ProductEditor } from "../components/product-editor";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const [categories, retailers] = await Promise.all([prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }), prisma.retailer.findMany({ where: { isActive: true }, select: { id: true, name: true, country: true }, orderBy: [{ priority: "asc" }, { name: "asc" }] })]);
  return <AdminShell user={user}><Link className="text-sm font-medium text-primary-600 hover:text-primary-950" href="/admin/products">← Back to products</Link><h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">Create product</h1><p className="mt-2 text-sm text-primary-600">Save as a draft until the product is ready for the storefront.</p>{categories.length ? <ProductEditor categories={categories} retailers={retailers} /> : <p className="mt-8 rounded-xl border border-dashed border-primary-300 bg-white p-6 text-sm text-primary-700">Create a category before adding a product.</p>}</AdminShell>;
}
