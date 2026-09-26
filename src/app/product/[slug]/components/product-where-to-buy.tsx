import Link from "next/link";
import { ExternalLink, MapPin, ShoppingBag } from "lucide-react";
import { getActiveProductRetailers, getActiveStores, isSafeExternalUrl, retailerClickPath } from "@/lib/where-to-buy";

export async function ProductWhereToBuy({ productId, productName }: { productId: string; productName: string }) {
  const [retailers, stores] = await Promise.all([getActiveProductRetailers(productId), getActiveStores()]);

  const validRetailers = retailers.filter((entry) => isSafeExternalUrl(entry.externalProductUrl));
  const retailer = validRetailers[0];
  const flagshipStores = stores.slice(0, 3);

  return (
    <section className="mt-10 rounded-[2rem] bg-[#f6ebe4] px-6 py-12 sm:px-10">
      <p className="font-accent text-[19px] italic text-accent-700">Where to buy</p>
      <h2 className="mt-3 max-w-md font-display text-3xl font-semibold leading-tight tracking-tight text-primary-950">
        {productName}, ready when you are.
      </h2>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_auto_1fr] lg:items-start">
        {/* Primary path: buy online */}
        <div>
          <div className="flex items-center gap-2 text-accent-700">
            <ShoppingBag size={16} />
            <span className="text-xl font-semibold uppercase tracking-wide">Buy online</span>
          </div>

          {retailer ? (
            <>
              <p className="mt-4 max-w-sm text-2xl leading-snug text-primary-950">
                Available now through <span className="font-display font-semibold">{retailer.retailer.name}</span>,
                one of our verified retail partners.
              </p>
              {/* Goes through /go so the click is counted before the retailer opens. */}
              <a
                href={retailerClickPath(productId, retailer.retailerId)}
                target="_blank"
                rel="nofollow noreferrer noopener"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-950 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
              >
                Buy on {retailer.retailer.name}
                <ExternalLink size={16} />
              </a>
              <p className="mt-4 max-w-sm text-xs leading-relaxed text-[#8a7288]">
                {retailer.retailer.name} handles checkout, delivery and returns under its own policies. For help with an
                online order, contact {retailer.retailer.name} directly.
              </p>
            </>
          ) : (
            <>
              <p className="mt-4 max-w-sm text-2xl leading-snug text-primary-950">
                Not available online right now.
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6b5867]">
                You can still pick up {productName} in store.
              </p>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="relative hidden self-stretch lg:block lg:w-px">
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,#d8c0c7_0,#d8c0c7_6px,transparent_6px,transparent_12px)]" />
          <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#e7d7d3] bg-white text-[11px] font-semibold text-[#8a7288]">
            or
          </span>
        </div>

        {/* Secondary path: find in store — treated as reference info, not a matching CTA card */}
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center gap-2 text-primary-700">
            <MapPin size={16} />
            <span className="text-xl font-semibold uppercase tracking-wide">Find in store</span>
          </div>

          {flagshipStores.length > 0 ? (
            <>
              <ul className="mt-4 space-y-3">
                {flagshipStores.map((store) => (
                  <li key={store.id} className="border-b border-[#eaddd9] pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-primary-950">{store.name}</p>
                    <p className="mt-0.5 text-xs text-[#8a7288]">
                      {[store.city, store.state].filter(Boolean).join(", ") || store.address}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href="/stores"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-900 transition-colors hover:text-accent-700"
              >
                See all locations
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </>
          ) : (
            <p className="mt-4 text-sm text-[#8a7288]">
              No physical stores are currently listed — visit the store directory for the latest locations.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}