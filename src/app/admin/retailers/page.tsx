import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";
import { RetailerForm } from "./components/retailer-form";
import { toggleRetailer } from "./actions";

export const dynamic = "force-dynamic";

const CLICK_WINDOW_DAYS = 30;
export default async function RetailersPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const [retailers, { retailerClicks, topProducts }] = await Promise.all([
    prisma.retailer.findMany({ include: { _count: { select: { products: true } } }, orderBy: [{ priority: "asc" }, { name: "asc" }] }),
    getClickStats(),
  ]);
  return <AdminShell user={user}><header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Purchasing</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Retailers</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-600">Manage external online retailers. Customers complete purchases on the retailer&apos;s website.</p></header><section className="mt-8 rounded-xl border border-primary-100 bg-white p-5 sm:p-6"><h2 className="font-display text-xl font-semibold">Add retailer</h2><RetailerForm /></section><section className="mt-8 overflow-hidden rounded-xl border border-primary-100 bg-white"><div className="border-b border-primary-100 px-5 py-4"><h2 className="font-display text-xl font-semibold">Online retailers</h2></div><div className="divide-y divide-primary-100">{retailers.map((retailer) => <article className="grid gap-4 px-5 py-5 lg:grid-cols-[1fr_auto]" key={retailer.id}><div><div className="flex flex-wrap items-center gap-3"><h3 className="font-semibold text-primary-950">{retailer.name}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${retailer.isActive ? "bg-green-50 text-green-700" : "bg-primary-100 text-primary-600"}`}>{retailer.isActive ? "Active" : "Inactive"}</span></div><p className="mt-1 text-sm text-primary-600">{retailer.country ?? "Country not listed"} · Priority {retailer.priority} · {retailer._count.products} linked product{retailer._count.products === 1 ? "" : "s"} · {plural(retailerClicks.get(retailer.id) ?? 0, "click")} in the last {CLICK_WINDOW_DAYS} days</p><RetailerForm retailer={retailer} /></div><form action={toggleRetailer}><input name="id" type="hidden" value={retailer.id} /><button className="h-fit text-sm font-semibold text-primary-700 underline-offset-4 hover:text-primary-950 hover:underline" type="submit">{retailer.isActive ? "Deactivate" : "Activate"}</button></form></article>)}{retailers.length === 0 && <p className="px-5 py-8 text-sm text-primary-600">No retailers have been added.</p>}</div></section><section className="mt-8 overflow-hidden rounded-xl border border-primary-100 bg-white"><div className="border-b border-primary-100 px-5 py-4"><h2 className="font-display text-xl font-semibold">Most clicked products</h2><p className="mt-1 text-sm text-primary-600">&ldquo;Buy on&rdquo; button clicks in the last {CLICK_WINDOW_DAYS} days. A click shows buying interest; the sale itself happens on the retailer&apos;s site.</p></div><ol className="divide-y divide-primary-100">{topProducts.map((product, index) => <li className="flex items-center justify-between gap-4 px-5 py-3 text-sm" key={product.id}><span className="text-primary-950"><span className="mr-3 text-primary-500">{index + 1}.</span>{product.name}</span><span className="font-medium text-primary-700">{plural(product.clicks, "click")}</span></li>)}{topProducts.length === 0 && <li className="px-5 py-8 text-sm text-primary-600">No clicks recorded yet.</li>}</ol></section></AdminShell>;
}

async function getClickStats() {
  const since = new Date(Date.now() - CLICK_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const [byRetailer, byProduct] = await Promise.all([
    prisma.retailerClick.groupBy({ by: ["retailerId"], where: { createdAt: { gte: since } }, _count: { _all: true } }),
    prisma.retailerClick.groupBy({ by: ["productId"], where: { createdAt: { gte: since } }, _count: { productId: true }, orderBy: { _count: { productId: "desc" } }, take: 10 }),
  ]);
  const products = await prisma.product.findMany({ where: { id: { in: byProduct.map((row) => row.productId) } }, select: { id: true, name: true } });
  const productNames = new Map(products.map((product) => [product.id, product.name]));
  return {
    retailerClicks: new Map(byRetailer.map((row) => [row.retailerId, row._count._all])),
    topProducts: byProduct.map((row) => ({ id: row.productId, name: productNames.get(row.productId) ?? "Unknown product", clicks: row._count.productId })),
  };
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
