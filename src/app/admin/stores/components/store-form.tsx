"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveStore, type StoreFormState } from "../actions";
import { STORE_DAYS, type OpeningHours, type StoreDay } from "@/lib/store-details";

export type StoreFormValue = {
  id: string;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  mapLink: string;
  isActive: boolean;
  openingHours: OpeningHours;
};

type DayHours = { open: string; close: string; closed: boolean };
const WEEKDAYS: StoreDay[] = ["tuesday", "wednesday", "thursday", "friday"];
const initialState: StoreFormState = {};

function toDayHours(entry: string | undefined): DayHours {
  if (entry === "closed") return { open: "", close: "", closed: true };
  if (entry) return { open: entry.slice(0, 5), close: entry.slice(6), closed: false };
  return { open: "", close: "", closed: false };
}

export function StoreForm({ store }: { store?: StoreFormValue }) {
  const [state, action, pending] = useActionState(saveStore, initialState);
  const [hours, setHours] = useState<Record<StoreDay, DayHours>>(
    () => Object.fromEntries(STORE_DAYS.map(({ key }) => [key, toDayHours(store?.openingHours[key])])) as Record<StoreDay, DayHours>
  );

  const update = (day: StoreDay, patch: Partial<DayHours>) => setHours((current) => ({ ...current, [day]: { ...current[day], ...patch } }));
  const copyMondayToWeekdays = () => setHours((current) => ({ ...current, ...Object.fromEntries(WEEKDAYS.map((day) => [day, { ...current.monday }])) }));

  return (
    <form action={action} className="mt-8 space-y-7">
      {store && <input name="id" type="hidden" value={store.id} />}

      <fieldset className="rounded-xl border border-primary-100 bg-white p-5 sm:p-6">
        <legend className="px-1 font-display text-xl font-semibold">Store details</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Store name" name="name" defaultValue={store?.name} required placeholder="e.g. Caring Chemistry Aba" />
          <Field label="Country" name="country" defaultValue={store?.country ?? "Nigeria"} required />
          <label className="text-sm font-medium text-primary-800 sm:col-span-2">
            Street address
            <textarea className="input mt-2 min-h-20" name="address" defaultValue={store?.address ?? ""} required placeholder="Building, street and area" />
          </label>
          <Field label="City" name="city" defaultValue={store?.city ?? ""} placeholder="e.g. Aba" />
          <Field label="State" name="state" defaultValue={store?.state ?? ""} placeholder="e.g. Abia" hint="Customers can filter stores by state." />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-primary-100 bg-white p-5 sm:p-6">
        <legend className="px-1 font-display text-xl font-semibold">Contact</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Phone" name="phone" type="tel" defaultValue={store?.phone ?? ""} placeholder="e.g. 0803 000 0000" hint="Shown as a tap-to-call button on phones." />
          <Field label="Email" name="email" type="email" defaultValue={store?.email ?? ""} placeholder="Optional" />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-primary-100 bg-white p-5 sm:p-6">
        <legend className="px-1 font-display text-xl font-semibold">Opening hours</legend>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-primary-600">Leave a day empty if its hours aren&apos;t known. Times use Lagos time.</p>
          <button type="button" onClick={copyMondayToWeekdays} className="text-sm font-semibold text-primary-800 underline-offset-4 hover:text-primary-950 hover:underline">
            Copy Monday to Tue–Fri
          </button>
        </div>
        <div className="mt-4 divide-y divide-primary-100 rounded-lg border border-primary-100">
          {STORE_DAYS.map((day) => {
            const value = hours[day.key];
            return (
              <div key={day.key} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 px-4 py-3 sm:grid-cols-[8rem_1fr_1fr_auto]">
                <span className="text-sm font-medium text-primary-900">{day.label}</span>
                <div className="col-start-2 grid grid-cols-2 gap-3 sm:col-span-2">
                  <label className="text-xs text-primary-500">
                    Opens
                    <input className="input mt-1 disabled:opacity-40" type="time" name={`hours.${day.key}.open`} value={value.open} disabled={value.closed} onChange={(event) => update(day.key, { open: event.target.value })} />
                  </label>
                  <label className="text-xs text-primary-500">
                    Closes
                    <input className="input mt-1 disabled:opacity-40" type="time" name={`hours.${day.key}.close`} value={value.close} disabled={value.closed} onChange={(event) => update(day.key, { close: event.target.value })} />
                  </label>
                </div>
                <label className="col-start-2 flex items-center gap-2 text-sm text-primary-800 sm:col-start-auto sm:justify-self-end">
                  <input className="h-4 w-4 accent-primary-950" type="checkbox" name={`hours.${day.key}.closed`} checked={value.closed} onChange={(event) => update(day.key, { closed: event.target.checked })} />
                  Closed
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-primary-100 bg-white p-5 sm:p-6">
        <legend className="px-1 font-display text-xl font-semibold">Location and visibility</legend>
        <div className="mt-4 space-y-5">
          <Field
            label="Google Maps link (optional)"
            name="mapLink"
            type="url"
            defaultValue={store?.mapLink ?? ""}
            placeholder="https://www.google.com/maps/place/…"
            hint="Pins the exact spot for “Get directions”. Open the store in Google Maps on a computer and copy the full link from the address bar. Without it, directions use the street address."
          />
          <label className="flex items-center gap-3 text-sm font-medium text-primary-800">
            <input className="h-4 w-4 accent-primary-950" defaultChecked={store?.isActive ?? true} name="isActive" type="checkbox" />
            Show this store on the public “Find a store” page
          </label>
        </div>
      </fieldset>

      {state.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button className="rounded-lg bg-primary-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60" disabled={pending} type="submit">
          {pending ? "Saving…" : store ? "Save changes" : "Add store"}
        </button>
        <Link className="text-sm font-medium text-primary-600 hover:text-primary-950" href="/admin/stores">Cancel</Link>
      </div>
    </form>
  );
}

function Field({ label, hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="text-sm font-medium text-primary-800">
      {label}
      <input className="input mt-2" {...props} />
      {hint && <span className="mt-1 block text-xs font-normal text-primary-500">{hint}</span>}
    </label>
  );
}
