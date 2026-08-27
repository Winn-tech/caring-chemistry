// app/components/brand-values.tsx
"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { FlaskConical, Leaf, PawPrint, ShieldCheck } from "lucide-react";
import { Reveal } from "./reveal";
import { useCountUp } from "@/app/hooks/use-count-up";

const VALUES = [
  {
    icon: FlaskConical,
    title: "Dermatologist Formulated",
    description:
      "Every product is developed with board-certified dermatologists and clinically tested before launch.",
  },
  {
    icon: Leaf,
    title: "Clean, Traceable Ingredients",
    description:
      "No parabens, sulfates, or synthetic fragrance — every ingredient is sourced and disclosed.",
  },
  {
    icon: PawPrint,
    title: "Cruelty-Free, Always",
    description:
      "Never tested on animals, at any stage, in any market we sell in.",
  },
  {
    icon: ShieldCheck,
    title: "30-Day Skin Guarantee",
    description:
      "Not a match for your skin? Full refund within 30 days, no questions asked.",
  },
];

const STATS = [
  { label: "5-star reviews", value: 15200, suffix: "+" },
  { label: "would repurchase", value: 98, suffix: "%" },
  { label: "ingredients tested", value: 340, suffix: "+" },
  { label: "years in the lab", value: 20, suffix: "+=" },
];

function StatCounter({
  value,
  suffix,
  label,
  inView,
}: {
  value: number;
  suffix: string;
  label: string;
  inView: boolean;
}) {
  const count = useCountUp(value, inView);

  return (
    <div>
      <p className="font-display text-4xl font-bold text-white sm:text-5xl">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-primary-200">{label}</p>
    </div>
  );
}

export function BrandValues() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <span className="font-accent text-lg italic text-accent-600">
            Why Caring Chemistry
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Formulated with intention, not trends.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 100} className="group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-white">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-primary-950">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-500">
                {description}
              </p>
            </Reveal>
          ))}
        </div>

        <div
          ref={ref}
          className="mt-20 grid grid-cols-2 gap-8 rounded-3xl bg-primary-950 px-8 py-12 sm:grid-cols-4 sm:px-12"
        >
          {STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}