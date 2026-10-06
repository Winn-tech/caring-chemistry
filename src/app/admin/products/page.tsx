import Link from "next/link";
import { ProductStatus, Role } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";
import { ArchiveProductForm } from "./components/archive-product-form";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const products = await prisma.product.findMany({ where: { deletedAt: null }, include: { category: true }, orderBy: { updatedAt: "desc" } });

  return <AdminShell user={user}><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Catalogue</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Products</h1><p className="mt-2 text-sm text-primary-600">Manage product details, retailer links and storefront availability.</p></div><Link className="rounded-lg bg-primary-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800" href="/admin/products/new">Add product</Link></header><section className="mt-8 overflow-hidden rounded-xl border border-primary-100 bg-white"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-primary-100 bg-primary-50 text-xs uppercase tracking-wide text-primary-600"><tr><th className="px-5 py-4 font-semibold">Product</th><th className="px-5 py-4 font-semibold">Category</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-primary-100">{products.map((product) => <tr key={product.id}><td className="px-5 py-4"><p className="font-semibold text-primary-950">{product.name}</p><p className="mt-1 text-xs text-primary-500">/{product.slug}</p></td><td className="px-5 py-4 text-primary-700">{product.category.name}</td><td className="px-5 py-4"><Status status={product.status} /></td><td className="px-5 py-4"><div className="flex items-center justify-end gap-4"><Link className="text-sm font-medium text-primary-800 hover:text-primary-950" href={`/admin/products/${product.id}`}>Edit</Link><ArchiveProductForm id={product.id} name={product.name} /></div></td></tr>)}{products.length === 0 && <tr><td className="px-5 py-12 text-center text-primary-600" colSpan={4}>No products yet. Create the first item in your catalogue.</td></tr>}</tbody></table></div></section></AdminShell>;
}
function Status({ status }: { status: ProductStatus }) { const active = status === ProductStatus.ACTIVE; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-700" : "bg-primary-100 text-primary-700"}`}>{active ? "Active" : "Draft"}</span>; }
