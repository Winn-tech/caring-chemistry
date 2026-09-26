import Link from "next/link";
import { PaymentStatus, Role } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";

export const dynamic = "force-dynamic";
const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

export default async function OrdersPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const orders = await prisma.order.findMany({ where: user.role === Role.SALES_TEAM ? { paymentStatus: PaymentStatus.PAID } : undefined, select: { id: true, reference: true, email: true, total: true, status: true, paymentStatus: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 100 });
  return <AdminShell user={user}><header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Fulfilment</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Orders</h1><p className="mt-2 text-sm text-primary-600">{user.role === Role.SALES_TEAM ? "Paid orders awaiting fulfilment or delivery." : "Review payment and fulfilment progress across the store."}</p></header><section className="mt-8 overflow-hidden rounded-xl border border-primary-100 bg-white"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-primary-100 bg-primary-50 text-xs uppercase tracking-wide text-primary-600"><tr><th className="px-5 py-4">Order</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Total</th><th className="px-5 py-4">Payment</th><th className="px-5 py-4">Fulfilment</th><th className="px-5 py-4"><span className="sr-only">View</span></th></tr></thead><tbody className="divide-y divide-primary-100">{orders.map((order) => <tr key={order.id}><td className="px-5 py-4"><p className="font-semibold">{order.reference}</p><p className="mt-1 text-xs text-primary-500">{order.createdAt.toLocaleDateString("en-NG", { dateStyle: "medium" })}</p></td><td className="px-5 py-4 text-primary-700">{order.email}</td><td className="px-5 py-4 text-primary-700">{money.format(Number(order.total))}</td><td className="px-5 py-4"><Badge value={order.paymentStatus} /></td><td className="px-5 py-4"><Badge value={order.status} /></td><td className="px-5 py-4 text-right"><Link className="font-medium text-primary-800 hover:text-primary-950" href={`/admin/orders/${order.id}`}>View</Link></td></tr>)}{orders.length === 0 && <tr><td className="px-5 py-12 text-center text-primary-600" colSpan={6}>No orders to show.</td></tr>}</tbody></table></div></section></AdminShell>;
}
function Badge({ value }: { value: string }) { return <span className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700">{value.replaceAll("_", " ")}</span>; }
