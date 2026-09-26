"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function RitualReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={false}
      whileInView={reduceMotion ? undefined : { y: [20, 0], opacity: [0.65, 1] }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
