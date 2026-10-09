import { Role } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";

export const dynamic = "force-dynamic";

const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

export default async function AdminDashboardPage() {
  const user = await requireAdminPage();

  if (user.role === Role.SOCIAL_TEAM) {
    const [drafts, published] = await Promise.all([
      prisma.blogPost.count({ where: { authorId: user.id, status: "DRAFT" } }),
      prisma.blogPost.count({ where: { authorId: user.id, status: "PUBLISHED" } }),
    ]);
    return <AdminShell user={user}><DashboardHeader user={user.name} /><section className="mt-8 grid gap-4 sm:grid-cols-2"><Metric label="Your drafts" value={String(drafts)} detail="Articles awaiting completion" /><Metric label="Published articles" value={String(published)} detail="Live journal posts" /></section><Focus title="Your publishing workspace" description="Create, edit and publish journal content. You can also manage the storefront announcement." /></AdminShell>;
  }

  const [products, activeProducts, orderCount, paidRevenue] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.order.count(),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
  ]);
  const mainAdmin = user.role === Role.GENERAL_ADMIN;
  const stores = mainAdmin ? await prisma.store.count() : null;

  return <AdminShell user={user}><DashboardHeader user={user.name} /><section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Paid revenue" value={naira.format(Number(paidRevenue._sum.total ?? 0))} detail="All completed payments" /><Metric label="Orders" value={String(orderCount)} detail="All recorded orders" /><Metric label="Products" value={String(products)} detail={`${activeProducts} currently active`} />{mainAdmin && <Metric label="Stores" value={String(stores)} detail="Registered store locations" />}</section><Focus title={mainAdmin ? "Store operations" : "Sales operations"} description={mainAdmin ? "You have full access to staff, catalogue, orders, content and operational settings." : "Manage the product catalogue and fulfilment workflow. Access is enforced again by the API for every action."} /></AdminShell>;
}

function DashboardHeader({ user }: { user: string }) {
  return <header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Operations</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {user.split(" ")[0]}.</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-600">A focused view of the work you’re allowed to manage.</p></header>;
}
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="rounded-xl border border-primary-100 bg-white p-5"><p className="text-sm font-medium text-primary-600">{label}</p><p className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-xs text-primary-500">{detail}</p></article>;
}
function Focus({ title, description }: { title: string; description: string }) {
  return <section className="mt-8 rounded-xl bg-primary-950 p-6 text-white"><h2 className="font-display text-2xl font-semibold">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary-200">{description}</p></section>;
}
