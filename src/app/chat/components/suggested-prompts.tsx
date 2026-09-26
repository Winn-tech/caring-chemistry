"use client";

import { motion } from "framer-motion";
import { Sparkles, Search, Droplet, Leaf } from "lucide-react";
import { SUGGESTED_PROMPTS } from "@/lib/chat/constants";
import type { SuggestedPrompt } from "@/lib/chat/types";
import type { ComponentType } from "react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  routine: Sparkles,
  product: Search,
  "dry-skin": Droplet,
  ingredients: Leaf,
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

interface SuggestedPromptsProps {
  onSelect: (prompt: SuggestedPrompt) => void;
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
    >
      {SUGGESTED_PROMPTS.map((suggestion) => {
        const Icon = ICONS[suggestion.id] ?? Sparkles;

        return (
          <motion.button
            key={suggestion.id}
            type="button"
            variants={item}
            onClick={() => onSelect(suggestion)}
            className="flex items-center gap-2.5 rounded-lg border border-primary-100 bg-white px-3.5 py-3 text-left text-sm text-primary-900 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <Icon className="h-4 w-4 shrink-0 text-accent-500" />
            {suggestion.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
