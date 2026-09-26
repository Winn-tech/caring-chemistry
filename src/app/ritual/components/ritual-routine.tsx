"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Droplets, FlaskConical, MoonStar, SunMedium } from "lucide-react";

const basics = [
  { title: "Cleanse", icon: Droplets, category: "cleansers", morning: "A fresh start. Gently cleanse without leaving your skin feeling tight.", evening: "Wash away the day. Gently remove sunscreen, makeup and daily buildup.", note: "Keep the water lukewarm" },
  { title: "Treat", icon: FlaskConical, category: "serums", morning: "An optional moment of targeted care. Choose a serum that suits your needs.", evening: "Use your chosen treatment as directed. You don’t need to layer every active.", note: "Optional, never obligatory" },
  { title: "Moisturize", icon: Droplets, category: "moisturizers", morning: "Help seal in hydration with a comfortable layer of moisturizer.", evening: "Finish with moisture. Choose a texture that leaves your skin feeling comfortable.", note: "A little barrier support" },
];

export function RitualRoutine() {
  const [period, setPeriod] = useState<"morning" | "evening">("morning");
  const reduceMotion = useReducedMotion();
  const morning = period === "morning";
  const steps = [
    ...basics.map((step) => ({ ...step, description: step[period] })),
    ...(morning ? [{ title: "Protect", icon: SunMedium, category: "essentials", description: "Finish with broad-spectrum SPF 30 or higher. Reapply according to its label.", note: "Your final morning step" }] : []),
  ];

  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div role="group" aria-label="Choose your routine" className="inline-flex w-fit gap-1 rounded-full border border-[#e5d9de] bg-white p-1.5">
          {(["morning", "evening"] as const).map((value) => {
            const Icon = value === "morning" ? SunMedium : MoonStar;
            return <button key={value} type="button" aria-pressed={period === value} aria-controls="routine-steps" onClick={() => setPeriod(value)} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors ${period === value ? "bg-[#30232d] text-white" : "text-[#766571] hover:bg-[#f9f5f2]"}`}><Icon size={17} />{value === "morning" ? "Morning" : "Evening"}</button>;
          })}
        </div>
        <p className="text-xs text-[#766571]">{morning ? "A fresh start. A protected finish." : "Let the day go. Give your skin some care."}</p>
      </div>
      <div id="routine-steps" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={period} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
            <ol className={`grid gap-4 sm:grid-cols-2 ${morning ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {steps.map((step, index) => (
                <li key={step.title} className={`group flex min-h-72 flex-col rounded-[1.75rem] border p-6 sm:p-7 ${morning ? "border-[#e5d9de] bg-[#fffcf8]" : "border-[#51414e] bg-[#30232d] text-white"}`}>
                  <div className="flex items-center justify-between"><span className={`font-accent text-4xl italic ${morning ? "text-[#b69aa8]" : "text-[#d9b7c8]"}`}>0{index + 1}</span><step.icon size={23} strokeWidth={1.3} className={morning ? "text-primary-950" : "text-[#efcdd9]"} /></div>
                  <h3 className="mt-8 font-display text-2xl font-semibold">{step.title}</h3>
                  <p className={`mt-3 flex-1 text-sm leading-relaxed ${morning ? "text-[#766571]" : "text-[#d5c5cf]"}`}>{step.description}</p>
                  <p className={`mb-5 mt-6 text-[11px] ${morning ? "text-primary-950" : "text-[#efcdd9]"}`}>{step.note}</p>
                  <Link href={`/shop?category[]=${step.category}`} className={`inline-flex items-center justify-between border-t pt-4 text-xs font-semibold ${morning ? "border-[#e5d9de]" : "border-[#655360]"}`}>Explore {step.category}<ArrowUpRight size={16} /></Link>
                </li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
