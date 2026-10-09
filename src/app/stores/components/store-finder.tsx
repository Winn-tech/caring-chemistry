"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Mail, MapPin, Navigation, Phone, Search } from "lucide-react";
import type { OpenStatus } from "@/lib/store-details";

export type PublicStore = {
  id: string;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  country: string;
  phone: string | null;
  telHref: string | null;
  email: string | null;
  directionsUrl: string;
  status: OpenStatus | null;
  hours: { label: string; value: string; today: boolean }[] | null;
};

const OTHER = "Other locations";

export function StoreFinder({ stores }: { stores: PublicStore[] }) {
  const [query, setQuery] = useState("");
  const [activeState, setActiveState] = useState("All");

  const states = useMemo(() => [...new Set(stores.map((store) => store.state).filter((value): value is string => Boolean(value)))].sort(), [stores]);

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = stores.filter((store) => {
      if (activeState !== "All" && store.state !== activeState) return false;
      if (!term) return true;
      return [store.name, store.address, store.city, store.state].some((value) => value?.toLowerCase().includes(term));
    });
    const byState = new Map<string, PublicStore[]>();
    for (const store of matches) {
      const key = store.state ?? OTHER;
      byState.set(key, [...(byState.get(key) ?? []), store]);
    }
    return [...byState.entries()].sort(([a], [b]) => (a === OTHER ? 1 : b === OTHER ? -1 : a.localeCompare(b)));
  }, [stores, query, activeState]);

  const resultCount = groups.reduce((total, [, list]) => total + list.length, 0);

  if (stores.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d9c8c8] bg-white px-6 py-12 text-center">
        <p className="font-display text-2xl font-semibold text-primary-950">Stores are coming soon</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6f5869]">We&apos;re preparing our store list. In the meantime, every product page links to our verified online retail partners.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full lg:max-w-sm">
          <span className="sr-only">Search stores</span>
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7288]" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by city, area or store name"
            className="w-full rounded-full border border-[#e2d3d6] bg-white py-3 pl-11 pr-4 text-sm text-[#2e2032] outline-none transition placeholder:text-[#a58d9b] focus:border-accent-600 focus:ring-2 focus:ring-accent-100"
          />
        </label>
        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label="Filter by state">
          {["All", ...states].map((value) => {
            const selected = activeState === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveState(value)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selected ? "border-primary-950 bg-primary-950 text-white" : "border-[#e2d3d6] bg-white text-[#4d3d50] hover:border-primary-300"}`}
              >
                {value === "All" ? "All states" : value}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-sm text-[#6f5869]" aria-live="polite">
        {resultCount} {resultCount === 1 ? "store" : "stores"}{activeState !== "All" ? ` in ${activeState}` : ""}
      </p>

      {resultCount === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#d9c8c8] bg-white px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold text-primary-950">No stores match your search</p>
          <p className="mt-2 text-sm text-[#6f5869]">Try another city or area, or browse all states.</p>
          <button type="button" onClick={() => { setQuery(""); setActiveState("All"); }} className="mt-5 rounded-full bg-primary-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800">
            Show all stores
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-12">
          {groups.map(([state, list]) => (
            <section key={state} aria-labelledby={`state-${state}`}>
              <h2 id={`state-${state}`} className="flex items-baseline gap-3 border-b border-[#e7dbd9] pb-3 font-display text-2xl font-semibold text-primary-950">
                {state}
                <span className="font-body text-sm font-normal text-[#8a7288]">{list.length} {list.length === 1 ? "store" : "stores"}</span>
              </h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {list.map((store) => <StoreCard key={store.id} store={store} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function StoreCard({ store }: { store: PublicStore }) {
  const place = [store.city, store.state, store.country].filter(Boolean).join(", ");
  return (
    <article className="flex flex-col rounded-2xl border border-[#e7d7d3] bg-white p-6 shadow-[0_15px_35px_rgba(74,48,63,0.04)] transition-shadow hover:shadow-[0_20px_45px_rgba(74,48,63,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-display text-xl font-semibold leading-snug text-primary-950">{store.name}</h3>
        {store.status && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${store.status.open ? "bg-emerald-50 text-emerald-700" : "bg-[#f3ecee] text-[#6f5869]"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${store.status.open ? "bg-emerald-500" : "bg-[#a58d9b]"}`} aria-hidden="true" />
            {store.status.label}
          </span>
        )}
      </div>

      <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-[#5f4c5d]">
        <MapPin size={16} className="mt-0.5 shrink-0 text-accent-700" aria-hidden="true" />
        <span>{store.address}<br /><span className="text-[#8a7288]">{place}</span></span>
      </p>
      {store.email && (
        <a href={`mailto:${store.email}`} className="mt-3 flex items-center gap-2.5 break-all text-sm text-[#5f4c5d] hover:text-primary-950">
          <Mail size={16} className="shrink-0 text-accent-700" aria-hidden="true" />
          {store.email}
        </a>
      )}

      {store.hours && (
        <details className="group mt-4 border-t border-[#efe4e2] pt-3">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-primary-900">
            Opening hours
            <ChevronDown size={16} className="text-[#8a7288] transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <dl className="mt-3 space-y-1.5 text-sm">
            {store.hours.map((row) => (
              <div key={row.label} className={`flex justify-between gap-4 rounded-md px-2 py-1 ${row.today ? "bg-[#f6ebe4] font-semibold text-primary-950" : "text-[#5f4c5d]"}`}>
                <dt>{row.label}{row.today && <span className="sr-only"> (today)</span>}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}

      <div className="mt-auto flex gap-3 pt-6">
        {store.telHref && (
          <a href={store.telHref} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary-950 px-4 py-2.5 text-sm font-semibold text-primary-950 transition-colors hover:bg-primary-950 hover:text-white" aria-label={`Call ${store.name} on ${store.phone}`}>
            <Phone size={15} aria-hidden="true" />
            Call
          </a>
        )}
        <a href={store.directionsUrl} target="_blank" rel="noreferrer noopener" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800" aria-label={`Get directions to ${store.name} (opens Google Maps)`}>
          <Navigation size={15} aria-hidden="true" />
          Directions
        </a>
      </div>
    </article>
  );
}
