import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";
import { CategoryForm } from "./components/category-form";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } });

  return <AdminShell user={user}>
    <header>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Catalogue</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Categories</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-600">Organise products into clear groups for the catalogue and storefront.</p>
    </header>
    <section className="mt-8 rounded-xl border border-primary-100 bg-white p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold">Add a category</h2>
      <CategoryForm />
    </section>
    <section className="mt-8 overflow-hidden rounded-xl border border-primary-100 bg-white">
      <div className="border-b border-primary-100 px-5 py-4"><h2 className="font-display text-xl font-semibold">Product categories</h2><p className="mt-1 text-sm text-primary-600">{categories.length} categor{categories.length === 1 ? "y" : "ies"}</p></div>
      <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-primary-100 bg-primary-50 text-xs uppercase tracking-wide text-primary-600"><tr><th className="px-5 py-4 font-semibold">Name</th><th className="px-5 py-4 font-semibold">Slug</th><th className="px-5 py-4 font-semibold">Products</th></tr></thead><tbody className="divide-y divide-primary-100">{categories.map((category) => <tr key={category.id}><td className="px-5 py-4 font-semibold text-primary-950">{category.name}</td><td className="px-5 py-4 text-primary-600">/{category.slug}</td><td className="px-5 py-4 text-primary-700">{category._count.products}</td></tr>)}</tbody></table></div>
    </section>
  </AdminShell>;
}