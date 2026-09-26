"use client";

import Link from "next/link";
import { useActionState } from "react";
import { issueInvoice, type InvoiceActionState } from "../actions";

const initialState: InvoiceActionState = {};

export function IssueInvoiceForm({ orderId }: { orderId: string }) {
  const [state, action, pending] = useActionState(issueInvoice, initialState);
  return <form action={action} className="mt-4"><input name="orderId" type="hidden" value={orderId} /><button className="rounded-lg bg-primary-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60" disabled={pending} type="submit">{pending ? "Issuing…" : "Issue invoice"}</button>{state.success && <p className="mt-3 text-sm text-emerald-700" role="status">{state.success} {state.invoiceId && <Link className="font-semibold underline" href={`/admin/invoices/${state.invoiceId}`}>View invoice</Link>}</p>}{state.error && <p className="mt-3 text-sm text-red-700" role="alert">{state.error}</p>}</form>;
}
