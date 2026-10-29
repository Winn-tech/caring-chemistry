// app/components/brand-values.tsx
import { RangeReel } from "./range-reel";
import { Reveal } from "./reveal";

interface BrandValuesProps {
  // Live counts from the database, so the proof shown here is always true.
  productCount: number;
  categoryCount: number;
  storeCount: number;
}

const PILLARS = [
  {
    title: "Made for every skin tone",
    description:
      "Our range is formulated with the full spectrum of skin tones in mind, so you can find care that suits your skin, whatever your shade.",
  },
  {
    title: "Quality you can trust",
    description:
      "From ingredient selection to the finished product, we pay attention to the details that matter, so every product earns its place in your routine.",
  },
  {
    title: "Transparent by design",
    description:
      "You deserve to know what you're using. We communicate clearly about our ingredients and how our products are made, so you can choose with confidence.",
  },
  {
    title: "Gentle on your skin",
    description:
      "Skincare should work with your skin, not against it. Our formulas are designed to care for your skin while respecting its natural balance and comfort.",
  },
];

export function BrandValues({ productCount, categoryCount, storeCount }: BrandValuesProps) {
  const proof = [
    { value: productCount, label: productCount === 1 ? "product in the range" : "products in the range" },
    { value: categoryCount, label: categoryCount === 1 ? "category of care" : "categories of care" },
    { value: storeCount, label: storeCount === 1 ? "store to visit" : "stores to visit" },
  ].filter((item) => item.value > 0);

  return (
    <section id="why-caring-chemistry" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal once className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent-700">
              <span aria-hidden="true" className="h-px w-10 bg-accent-500" />
              Why Caring Chemistry
            </p>
            <h2 className="mt-5 max-w-3xl font-display text-[2.6rem] leading-[1] tracking-[-0.045em] text-primary-950 sm:text-6xl lg:text-7xl">
              <span className="font-light">Formulated with </span>
              <span className="font-bold">intention</span>
              <span className="font-light">, not trends.</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed text-primary-900/75 lg:pb-2">
            We make skincare and body care for real routines and every skin tone: considered formulas, clearly explained, and made to be used every day.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {/* product videos, held in view while the pillars scroll past */}
          <Reveal once className="lg:sticky lg:top-28 lg:self-start">
            <RangeReel />
          </Reveal>

          <div>
            <ol className="border-t border-primary-100">
              {PILLARS.map((pillar, i) => (
                <li key={pillar.title} className="border-b border-primary-100">
                  <Reveal once delay={i * 80} className="group grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 sm:gap-x-4 py-8 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:py-10">
                    <span aria-hidden="true" className="pt-1.5 text-sm font-semibold tabular-nums text-accent-600 sm:pt-2.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold leading-tight tracking-[-0.03em] text-primary-950 sm:text-[2rem]">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-base leading-relaxed text-primary-900/70">{pillar.description}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            {proof.length > 0 && (
              <Reveal once delay={120}>
                <ul className={`mt-10 grid gap-3 sm:gap-6 sm:mt-12 ${proof.length === 3 ? "grid-cols-3" : proof.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {proof.map((item) => (
                    <li key={item.label} className="rounded-[1.5rem] bg-[#F7F3EF] px-4 py-5 sm:px-6 sm:py-6">
                      <span className="block text-3xl font-bold tabular-nums tracking-[-0.04em] text-primary-950 sm:text-5xl">{item.value}</span>
                      <span className="mt-1.5 block text-xs leading-snug text-primary-900/65 sm:text-sm">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
