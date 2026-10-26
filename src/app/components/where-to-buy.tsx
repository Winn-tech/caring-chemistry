// app/components/where-to-buy.tsx
import Link from "next/link";
import { ArrowUpRight, MessageCircle, ShoppingBag, Store } from "lucide-react";
import { COMPANY_PHONES } from "@/lib/company";
import { Reveal } from "./reveal";

interface WhereToBuyProps {
  retailers: { id: string; name: string; websiteUrl: string }[];
  storeCount: number;
}

const CARD = "flex h-full flex-col rounded-2xl border border-primary-100 bg-white p-6";
const ICON = "flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F3EF] text-accent-600";
const LABEL = "mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-500";

export function WhereToBuy({ retailers, storeCount }: WhereToBuyProps) {
  return (
    <section id="where-to-buy" className="scroll-mt-20 bg-[#F7F3EF] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal once className="max-w-2xl">
          <span className="font-accent text-lg italic text-accent-600">Ready when you are</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">Where to Buy</h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-700 sm:text-base">
            Order from a trusted online partner, pick up from a store near you, or message us and we&apos;ll help you choose.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-3">
          {retailers.length > 0 && (
            <Reveal once delay={0}>
              <div className={CARD}>
                <span className={ICON}><ShoppingBag size={20} aria-hidden="true" /></span>
                <p className={LABEL}>Buy online</p>
                <p className="mt-2 text-sm leading-relaxed text-primary-700">Checkout, delivery and returns are handled by our retail partners.</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {retailers.map((retailer) => (
                    <li key={retailer.id}>
                      <a
                        href={retailer.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-primary-200 px-3.5 py-1.5 text-sm font-semibold text-primary-950 transition-colors hover:border-accent-400 hover:text-accent-700"
                      >
                        {retailer.name}
                        <ArrowUpRight size={14} aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {storeCount > 0 && (
            <Reveal once delay={80}>
              <Link href="/stores" className={`${CARD} group transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-300`}>
                <span className={ICON}><Store size={20} aria-hidden="true" /></span>
                <p className={LABEL}>Visit a store</p>
                <p className="mt-2 text-sm leading-relaxed text-primary-700">
                  {storeCount} {storeCount === 1 ? "store" : "stores"} with addresses, opening hours and directions.
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-accent-700">
                  Find a store
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          )}

          <Reveal once delay={160}>
            <div className={CARD}>
              <span className={ICON}><MessageCircle size={20} aria-hidden="true" /></span>
              <p className={LABEL}>WhatsApp or call</p>
              <p className="mt-2 text-sm leading-relaxed text-primary-700">Questions about a product or your routine? We&apos;re a message away.</p>
              <ul className="mt-4 space-y-2">
                {COMPANY_PHONES.map((phone) => (
                  <li key={phone.international} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {phone.whatsappOnly ? (
                      <span className="text-sm text-primary-600 sm:text-base">
                        WhatsApp only:{" "}
                        <a href={phone.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-950 transition-colors hover:text-accent-700">
                          {phone.display}
                          <span className="sr-only"> (opens WhatsApp in a new tab)</span>
                        </a>
                      </span>
                    ) : (
                      <>
                        <a href={phone.telUrl} className="text-sm font-medium text-primary-950 transition-colors hover:text-accent-700 sm:text-base">
                          {phone.display}
                        </a>
                        <a
                          href={phone.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-accent-700 transition-colors hover:text-accent-800"
                        >
                          WhatsApp<span className="sr-only"> {phone.display} (opens in a new tab)</span>
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
