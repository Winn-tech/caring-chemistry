"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock, MapPin, Phone, Search } from "lucide-react";
import { toggleStore } from "../actions";

export type StoreListItem = {
  id: string;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  country: string;
  phone: string | null;
  hasHours: boolean;
  hasPin: boolean;
  isActive: boolean;
};

type StatusFilter = "all" | "active" | "inactive";

export function StoreList({ stores }: { stores: StoreListItem[] }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const states = useMemo(() => [...new Set(stores.map((store) => store.state).filter((value): value is string => Boolean(value)))].sort(), [stores]);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return stores.filter((store) => {
      if (state !== "all" && store.state !== state) return false;
      if (status === "active" && !store.isActive) return false;
      if (status === "inactive" && store.isActive) return false;
      if (!term) return true;
      return [store.name, store.address, store.city, store.state].some((value) => value?.toLowerCase().includes(term));
    });
  }, [stores, query, state, status]);

  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-primary-100 bg-white">
      <div className="flex flex-col gap-3 border-b border-primary-100 p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search stores</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" aria-hidden="true" />
          <input className="input pl-9" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, address or city" />
        </label>
        <label className="sm:w-44">
          <span className="sr-only">Filter by state</span>
          <select className="input" value={state} onChange={(event) => setState(event.target.value)}>
            <option value="all">All states</option>
            {states.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="sm:w-40">
          <span className="sr-only">Filter by status</span>
          <select className="input" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>

      <ul className="divide-y divide-primary-100">
        {visible.map((store) => (
          <li key={store.id} className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-semibold text-primary-950">{store.name}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${store.isActive ? "bg-emerald-50 text-emerald-700" : "bg-primary-100 text-primary-600"}`}>
                  {store.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-1.5 flex items-start gap-1.5 text-sm text-primary-600">
                <MapPin size={14} className="mt-0.5 shrink-0 text-primary-400" aria-hidden="true" />
                <span>{store.address} · {[store.city, store.state, store.country].filter(Boolean).join(", ")}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-primary-500">
                <span className="flex items-center gap-1"><Phone size={12} aria-hidden="true" />{store.phone ?? "No phone"}</span>
                <span className={`flex items-center gap-1 ${store.hasHours ? "" : "text-amber-700"}`}><Clock size={12} aria-hidden="true" />{store.hasHours ? "Hours listed" : "No opening hours"}</span>
                <span className="flex items-center gap-1"><MapPin size={12} aria-hidden="true" />{store.hasPin ? "Map pin set" : "Directions by address"}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link className="text-sm font-medium text-primary-800 hover:text-primary-950" href={`/admin/stores/${store.id}`}>Edit</Link>
              <form action={toggleStore}>
                <input name="id" type="hidden" value={store.id} />
                <button className="text-sm font-medium text-primary-600 underline-offset-4 hover:text-primary-950 hover:underline" type="submit">
                  {store.isActive ? "Deactivate" : "Activate"}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      {stores.length === 0 && <p className="px-5 py-12 text-center text-sm text-primary-600">No stores yet. Add your first location.</p>}
      {stores.length > 0 && visible.length === 0 && <p className="px-5 py-12 text-center text-sm text-primary-600">No stores match these filters.</p>}
    </section>
  );
}
