// app/components/footer/footer-motion.tsx
"use client";

import type { ReactNode } from "react";
import { motion, MotionConfig, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

/** Staggers its FooterItem children in as the block scrolls into view. Honors reduced-motion settings. */
export function FooterStagger({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

export function FooterItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}

const letter: Variants = {
  hidden: { y: "105%" },
  show: (index: number) => ({ y: "0%", transition: { duration: 0.9, ease: EASE, delay: index * 0.035 } }),
};

/** Oversized brand wordmark whose letters rise out of a clipping mask, one after another. */
export function FooterWordmark({ text }: { text: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.p
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="flex select-none justify-center whitespace-nowrap font-display text-[clamp(2.25rem,8.6vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]"
      >
        {Array.from(text).map((character, index) => (
          <span key={index} className="inline-block overflow-hidden pb-[0.08em]">
            <motion.span
              custom={index}
              variants={letter}
              className="inline-block bg-linear-to-b from-white/90 via-primary-200/60 to-primary-300/10 bg-clip-text text-transparent"
            >
              {character === " " ? " " : character}
            </motion.span>
          </span>
        ))}
      </motion.p>
    </MotionConfig>
  );
}
