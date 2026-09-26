// app/components/brand-values.tsx
"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Icon } from "@iconify/react";
import { Reveal } from "./reveal";
import { useCountUp } from "@/app/hooks/use-count-up";

const VALUES = [
  {
    icon: "fluent-emoji:alembic",
    tone: "rose",
    title: "Dermatologist Formulated",
    description:
      "Every product is developed with board-certified dermatologists and clinically tested before launch.",
  },
  {
    icon: "fluent-emoji:herb",
    tone: "gold",
    title: "Quality You Can Trust",
    description:
      "From ingredient selection to the final product, we pay attention to the details that matter. Our focus is on creating consistently high-quality skincare you can confidently make part of your daily routine.",
  },
  {
    icon: "fluent-emoji:eye",
    tone: "rose",
    title: "Transparent by Design",
    description:
      "We believe you deserve to know what you're using. From our ingredients to how our products are made, we aim to communicate clearly so you can make informed choices about your skincare.",
  },
  {
    icon: "fluent-emoji:shield",
    tone: "gold",
    title: "Gentle on Your Skin",
    description: "We believe skincare should work with your skin, not against it. Our formulas are thoughtfully designed to deliver meaningful results while supporting your skin's natural balance and comfort.",
  },
];

const STATS = [
  { label: "5-star reviews", value: 15200, suffix: "+" },
  { label: "would repurchase", value: 98, suffix: "%" },
  { label: "ingredients tested", value: 340, suffix: "+" },
  { label: "years in the lab", value: 20, suffix: "+" },
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
          {VALUES.map(({ icon, tone, title, description }, i) => (
            <Reveal key={title} delay={i * 100} className="group">
              <div className={`brand-value-icon brand-value-icon-${tone}`} aria-hidden="true">
                <div className="brand-value-icon-face">
                  <Icon className="brand-value-icon-art" icon={icon} width={64} height={64} />
                </div>
              </div>
              <h3 className="mt-5 font-display text-[22px] font-semibold text-primary-950">
                {title}
              </h3>
              <p className="mt-2 text-[17px] leading-relaxed text-primary-500">
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