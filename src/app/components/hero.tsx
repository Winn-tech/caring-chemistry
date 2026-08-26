// components/Hero.tsx
import Link from "next/link";

const SHADE_STRIP = [
  "bg-accent-300",
  "bg-accent-500",
  "bg-primary-400",
  "bg-primary-600",
  "bg-accent-700",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary-950">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-accent-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-10 h-[22rem] w-[22rem] rounded-full bg-primary-500/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-32">
        <div>
          {/* eyebrow + signature shade strip */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex -space-x-1">
              {SHADE_STRIP.map((color, i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full ring-2 ring-primary-950 ${color}`}
                />
              ))}
            </div>
            <span className="font-accent text-lg italic text-primary-200">
              New — Skin Rituals
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Skincare tuned to
            <br />
            your undertone.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-primary-200">
            Formulated in small batches, matched to your skin&apos;s actual
            chemistry — not a shade card. Ships within Lagos in 48 hours.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-accent-500 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Shop the Edit
            </Link>
            <Link
              href="/rituals"
              className="rounded-full border border-primary-400 px-7 py-3.5 text-sm font-semibold text-primary-100 transition-colors hover:border-accent-400 hover:text-accent-300"
            >
              Take the Skin Quiz
            </Link>
          </div>
        </div>

        {/* product frame */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
          <div className="absolute inset-0 rounded-[2rem] border border-primary-700 bg-primary-900/60 shadow-2xl" />
          <div className="absolute inset-6 rounded-[1.5rem] bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950" />
          <div className="absolute bottom-8 left-8 right-8 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <p className="font-accent text-lg italic text-accent-300">
              Le Serum No. 3
            </p>
            <p className="mt-1 text-xs text-primary-200">
              Niacinamide · Peptide complex
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}