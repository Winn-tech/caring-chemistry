// app/components/hero.tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroReel } from "./hero-reel";
import { IngredientRibbon } from "./ingredient-ribbon";

const TRUST_POINTS = [
  { value: "15,200+", label: "five-star reviews" },
  { value: "98%", label: "would repurchase" },
  { value: "20+", label: "years in the lab" },
];

const INGREDIENTS = [
  "Niacinamide",
  "Peptide Complex",
  "Hyaluronic Acid",
  "Ceramides",
  "Vitamin C",
  "Squalane",
  "Centella",
  "Bakuchiol",
];

export function Hero() {
  return (
    <section className="hero-luxe relative isolate overflow-hidden text-white">
      {/* backdrop */}
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="hero-orb pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-16 pt-14 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-24 lg:pt-20">
        {/* copy */}
        <div className="lg:col-span-7">
          <div
            className="hero-rise inline-flex items-center gap-3 rounded-full border border-accent-300/25 bg-white/[0.04] py-1.5 pl-2 pr-4 backdrop-blur-sm"
            style={{ "--hero-delay": "0ms" } as React.CSSProperties}
          >
            <span aria-hidden="true" className="flex -space-x-1">
              {["#f4dcc9", "#d49a6a", "#9a5f38", "#45271a"].map((tone) => (
                <span
                  key={tone}
                  className="h-4 w-4 rounded-full ring-2 ring-[var(--hero-ink)]"
                  style={{ backgroundColor: tone }}
                />
              ))}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-200">
              Products for every skin tone
            </span>
          </div>

          <h1
            className="hero-rise mt-8 font-display text-[3.25rem] font-semibold leading-[0.95] tracking-[-0.035em] sm:text-7xl xl:text-[5.75rem]"
            style={{ "--hero-delay": "120ms" } as React.CSSProperties}
          >
            Beauty in
            <br />
            <span className="hero-gold-text pr-2 font-accent text-[1.12em] font-normal tracking-[-0.01em]">
              every
            </span>
            shade.
          </h1>

          <p
            className="hero-rise mt-7 max-w-lg text-base leading-relaxed text-primary-100/75 sm:text-lg"
            style={{ "--hero-delay": "240ms" } as React.CSSProperties}
          >
            Skincare formulated and tested across the full spectrum of skin
            tones. Safe, effective and made for you.
          </p>

          <div
            className="hero-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
            style={{ "--hero-delay": "360ms" } as React.CSSProperties}
          >
            <Link
              href="/shop"
              className="hero-cta group inline-flex items-center gap-3 rounded-full py-2 pl-7 pr-2 text-sm font-semibold text-[#2a0619] outline-none focus-visible:ring-2 focus-visible:ring-accent-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--hero-ink)]"
            >
              Shop the Collection
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a0619] text-accent-200 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
            <Link
              href="/journal"
              className="group relative rounded text-sm font-medium text-primary-50 outline-none focus-visible:ring-2 focus-visible:ring-accent-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--hero-ink)]"
            >
              Read the Journal
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-accent-300/60 transition-transform duration-500 group-hover:scale-x-0" />
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent-300 transition-transform delay-150 duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          </div>

          <dl
            className="hero-rise mt-14 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6"
            style={{ "--hero-delay": "480ms" } as React.CSSProperties}
          >
            {TRUST_POINTS.map(({ value, label }) => (
              <div key={label} className="px-4 first:pl-0">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block font-display text-xl font-semibold text-accent-200 sm:text-2xl">
                    {value}
                  </span>
                  <span className="mt-1 block text-xs text-primary-100/60">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* visual */}
        <div className="lg:col-span-5">
          <HeroReel />
        </div>
      </div>

      {/* ingredient ribbon */}
      <IngredientRibbon items={INGREDIENTS} />
    </section>
  );
}
