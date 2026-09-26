import Link from "next/link";
import { MapPin, Navigation, Phone } from "lucide-react";
import { getActiveStores } from "@/lib/where-to-buy";

export const dynamic = "force-dynamic";

export default async function StoreDirectoryPage() {
  const stores = await getActiveStores();

  return (
    <main className="min-h-screen bg-[#fffaf6] text-[#2e2032]">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Retail locations</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-primary-950">Find a store</h1>
          </div>
          <Link href="/shop" className="text-sm font-medium text-primary-700 hover:text-primary-950">Back to shop</Link>
        </div>

        {stores.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[#d9c8c8] bg-white px-6 py-8 text-sm text-[#6f5869]">
            No physical stores are currently listed.
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {stores.map((store) => {
              const directionsUrl = store.latitude && store.longitude
                ? `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.address} ${store.city || ""} ${store.state || ""} ${store.country}`)}`;

              return (
                <article key={store.id} className="rounded-2xl border border-[#e7d7d3] bg-white p-5 shadow-[0_15px_35px_rgba(74,48,63,0.03)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl font-semibold text-primary-950">{store.name}</p>
                      <p className="mt-1 text-sm text-[#6b5867]">{store.city || "City not listed"}, {store.state || "State not listed"}</p>
                    </div>
                    <span className="rounded-full bg-primary-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-700">Listed location</span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-[#5f4c5d]">
                    <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-accent-700" />{store.address}</p>
                    <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-accent-700" />{store.city || "City not listed"}, {store.state || "State not listed"}, {store.country}</p>
                    {store.phone && <p className="flex items-center gap-2"><Phone size={16} className="text-accent-700" />{store.phone}</p>}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <a href={directionsUrl} target="_blank" rel="noreferrer noopener" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-950 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-primary-800">
                      <Navigation size={15} />
                      Get directions
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
