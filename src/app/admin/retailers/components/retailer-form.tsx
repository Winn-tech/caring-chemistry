"use client";

import { useActionState } from "react";
import { saveRetailer, type RetailerFormState } from "../actions";

type Retailer = { id: string; name: string; country: string | null; websiteUrl: string | null; priority: number; isActive: boolean };
const initialState: RetailerFormState = {};

export function RetailerForm({ retailer }: { retailer?: Retailer }) {
  const [state, action, pending] = useActionState(saveRetailer, initialState);
  return <form action={action} className="mt-5 grid gap-4 sm:grid-cols-2">
    {retailer && <input name="id" type="hidden" value={retailer.id} />}
    <Field label="Name" name="name" defaultValue={retailer?.name ?? ""} required />
    <Field label="Country" name="country" defaultValue={retailer?.country ?? ""} />
    <Field label="Website URL" name="websiteUrl" type="url" defaultValue={retailer?.websiteUrl ?? ""} placeholder="https://..." />
    <Field label="Priority" name="priority" type="number" min="0" max="1000000" defaultValue={String(retailer?.priority ?? 0)} required />
    <label className="flex items-center gap-3 self-end pb-2 text-sm font-medium text-primary-800"><input className="h-4 w-4 accent-primary-950" defaultChecked={retailer?.isActive ?? true} name="isActive" type="checkbox" />Active</label>
    {state.error && <p className="sm:col-span-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.error}</p>}
    {state.success && <p className="sm:col-span-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700" role="status">{state.success}</p>}
    <button className="w-fit rounded-lg bg-primary-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={pending} type="submit">{pending ? "Saving..." : retailer ? "Save changes" : "Add retailer"}</button>
  </form>;
}
function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className="text-sm font-medium text-primary-800">{label}<input className="input mt-2" {...props} /></label>; }
