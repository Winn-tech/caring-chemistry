"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  const dots = [0, 1, 2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2 self-start"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-900/10 text-primary-700">
        <span className="h-2 w-2 rounded-full bg-primary-700" />
      </span>

      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-primary-100 bg-white px-3 py-2.5 shadow-sm">
        {dots.map((dot) => (
          <motion.span
            key={dot}
            className="h-2.5 w-2.5 rounded-full bg-primary-300"
            animate={{
              y: [0, -4, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
              delay: dot * 0.12,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
