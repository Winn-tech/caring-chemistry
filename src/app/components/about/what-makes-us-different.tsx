import { Beaker, HeartHandshake, ShieldCheck } from "lucide-react";
import { Reveal } from "../reveal";

const DIFFERENTIATORS = [
  { icon: Beaker, number: "01", title: "Thoughtful Ingredients", description: "Every formula starts from the ingredient up, not from a trend." },
  { icon: ShieldCheck, number: "02", title: "Skin-First Formulas", description: "Developed with dermatologist input, tested before they ever ship." },
  { icon: HeartHandshake, number: "03", title: "Cruelty-Free", description: "Never tested on animals, at any stage, in any market." },
];

export function WhatMakesUsDifferent() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <style>{`
        .wmud-card {
          position: relative;
          isolation: isolate;
        }
        .wmud-card::before {
          content: "";
          position: absolute;
          inset: -1.5px;
          border-radius: 1.5rem;
          padding: 1.5px;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            transparent 78%,
            #c88041 88%,
            #765d7d 96%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          animation: wmud-sweep 2.4s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        .wmud-card:hover::before {
          opacity: 1;
        }
        @keyframes wmud-sweep {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .wmud-card::before {
            animation: none;
          }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent-100/70 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <span className="font-accent text-lg italic bg-linear-to-r from-accent-700 to-primary-700 bg-clip-text text-transparent">
            What Makes Us Different
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Why we do things{" "}
            <span className="relative inline-block">
              <span className="relative z-10">differently.</span>
              <span
                aria-hidden
                className="absolute bottom-1 left-0 -z-0 h-3 w-full -rotate-1 rounded-full bg-accent-200/70"
              />
            </span>
          </h2>
          <p className="mt-4 max-w-md text-[18px] leading-relaxed text-gray-700">
            Three pillars that shape every formula, every decision, and every interaction.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {DIFFERENTIATORS.map(({ number, title, description }, index) => (
            <Reveal key={number} delay={index * 100}>
              <div className="wmud-card group relative h-full overflow-hidden rounded-3xl border border-primary-100 bg-white p-7 shadow-[0_10px_30px_-15px_rgba(168,13,97,0.15)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_50px_-20px_rgba(198,42,126,0.35)]">
                {/* Gradient wash on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-50/0 via-transparent to-accent-50/0 opacity-0 transition-opacity duration-500 group-hover:from-primary-50/60 group-hover:to-accent-50/60 group-hover:opacity-100"
                />

                <div className="relative flex items-center justify-between">
                  {/* <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white text-primary-700 shadow-[0_8px_20px_-10px_rgba(193,10,116,0.25)] transition-all duration-500 group-hover:rotate-[8deg] group-hover:scale-110 group-hover:border-accent-400 group-hover:from-accent-100 group-hover:to-white group-hover:text-primary-900">
                    <Icon size={22} />
                  </div> */}
                  <div className='h-14 w-14'></div>
                  <span className="font-display text-3xl font-bold leading-none tracking-tight text-primary-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-accent-400 group-hover:to-primary-700 group-hover:bg-clip-text group-hover:text-transparent">
                    {number}
                  </span>
                </div>

                <h3 className="relative mt-7 font-display text-xl font-semibold text-primary-950">
                  {title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-primary-500 lg:text-[17px]">
                  {description}
                </p>

                {/* Animated underline accent */}
                <div
                  aria-hidden
                  className="relative mt-5 h-0.5 w-0 rounded-full bg-gradient-to-r from-accent-400 to-primary-500 transition-all duration-500 group-hover:w-12"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
