// app/components/ui/reveal.tsx
"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  animated?: boolean;
}

export function Reveal({ children, delay = 0, className = "", once = true, animated = true }: RevealProps) {
  if (!animated) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}