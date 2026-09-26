import Link from "next/link";
import { Role } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";

export const dynamic = "force-dynamic";
const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

export default async function InvoicesPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const invoices = await prisma.invoice.findMany({ include: { order: { select: { reference: true } }, creditNotes: { select: { id: true } } }, orderBy: { issuedAt: "desc" } });
  return <AdminShell user={user}><header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Finance</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Invoices</h1><p className="mt-2 text-sm text-primary-600">Issued invoices are immutable snapshots of successfully paid orders.</p></header><section className="mt-8 overflow-hidden rounded-xl border border-primary-100 bg-white"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-primary-100 bg-primary-50 text-xs uppercase tracking-wide text-primary-600"><tr><th className="px-5 py-4">Invoice</th><th className="px-5 py-4">Order</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Issued</th><th className="px-5 py-4">Total</th><th className="px-5 py-4">Credit note</th><th className="px-5 py-4"><span className="sr-only">View</span></th></tr></thead><tbody className="divide-y divide-primary-100">{invoices.map((invoice) => <tr key={invoice.id}><td className="px-5 py-4 font-semibold text-primary-950">{invoice.number}</td><td className="px-5 py-4 text-primary-700">{invoice.order.reference}</td><td className="px-5 py-4 text-primary-700">{invoice.customerEmail}</td><td className="px-5 py-4 text-primary-700">{invoice.issuedAt.toLocaleDateString("en-NG", { dateStyle: "medium" })}</td><td className="px-5 py-4 text-primary-700">{money.format(Number(invoice.total))}</td><td className="px-5 py-4 text-primary-700">{invoice.creditNotes.length ? "Issued" : "—"}</td><td className="px-5 py-4 text-right"><Link className="font-medium text-primary-800 hover:text-primary-950" href={`/admin/invoices/${invoice.id}`}>View</Link></td></tr>)}{invoices.length === 0 && <tr><td className="px-5 py-12 text-center text-primary-600" colSpan={7}>No invoices have been issued.</td></tr>}</tbody></table></div></section></AdminShell>;
}
