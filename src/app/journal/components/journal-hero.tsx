"use client";

import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface JournalHeroProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function JournalHero({ query, onQueryChange }: JournalHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#f2ede8] px-6 pb-16 pt-24 sm:pb-20 sm:pt-32">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute -right-32 -top-36 h-80 w-80 rounded-full border border-accent-200/60" />
      <motion.div animate={{ y: [0, -12, 0], opacity: [0.35, 0.7, 0.35] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute bottom-8 left-[12%] h-3 w-3 rounded-full bg-accent-400/60" />
      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center justify-center gap-3 text-accent-700">
          <Sparkles size={16} strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-[0.24em]">The Beauty Journal</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="mx-auto mt-6 max-w-3xl font-display text-5xl font-semibold leading-[0.95] text-primary-950 sm:text-7xl">
          Beauty knowledge, made simple.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.25 }} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-600">
          Expert insights, skincare routines, ingredient guides and beauty stories to help you make better choices for your skin.
        </motion.p>
        <motion.label initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }} className="mx-auto mt-9 flex max-w-xl items-center gap-3 rounded-full border border-primary-300 bg-white px-5 py-3.5 text-left shadow-[0_12px_35px_rgba(63,45,67,0.08)] focus-within:border-accent-500">
          <Search size={18} className="shrink-0 text-primary-500" />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search skincare, ingredients..." aria-label="Search journal articles" className="min-w-0 flex-1 bg-transparent text-sm text-primary-900 outline-none placeholder:text-primary-400" />
        </motion.label>
      </div>
    </section>
  );
}
