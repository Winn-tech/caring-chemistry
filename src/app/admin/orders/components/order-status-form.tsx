"use client";

import { useActionState } from "react";
import { OrderStatus } from "@/generated/prisma/enums";
import { updateOrderStatus, type OrderActionState } from "../actions";

const labels: Record<OrderStatus, string> = { PENDING_PAYMENT: "Pending payment", PAID: "Paid", PROCESSING: "Processing", SHIPPED: "Shipped", DELIVERED: "Delivered", CANCELLED: "Cancelled", REFUNDED: "Refunded" };
const initialState: OrderActionState = {};

export function OrderStatusForm({ id, options }: { id: string; options: readonly OrderStatus[] }) {
  const [state, action, pending] = useActionState(updateOrderStatus, initialState);
  if (!options.length) return <p className="text-sm text-primary-600">No further fulfillment actions are available.</p>;
  return <form action={action} className="mt-5 flex flex-wrap items-end gap-3"><input name="id" type="hidden" value={id} /><label className="min-w-48 text-sm font-medium text-primary-800">Update fulfillment status<select className="input mt-2" name="status">{options.map((status) => <option key={status} value={status}>{labels[status]}</option>)}</select></label><button className="rounded-lg bg-primary-950 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60" disabled={pending} type="submit">{pending ? "Updating…" : "Update status"}</button>{state.error && <p className="w-full text-sm text-red-700" role="alert">{state.error}</p>}{state.success && <p className="w-full text-sm text-emerald-700" role="status">{state.success}</p>}</form>;
}
