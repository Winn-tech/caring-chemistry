"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ShopHeaderProps {
  title: string;
  count: number;
  imageUrl?: string;
}

const DESCRIPTIONS: Record<string, string> = {
  "Shop All Beauty":
    "Skincare, body care, and beauty essentials thoughtfully formulated to help you build a simple, effective routine.",
};

export function ShopHeader({ title, count, imageUrl }: ShopHeaderProps) {
  const description =
    DESCRIPTIONS[title] ??
    "Formulated with intention — browse a curated edit of our best-working products.";

  if (imageUrl) {
    return (
      <header className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-accent text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight max-w-2xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-lg leading-relaxed text-white/90 max-w-2xl"
          >
            {description}
          </motion.p>
        </div>
      </header>
    );
  }

  return (
    <header className="pt-6 pb-6 max-w-2xl">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="font-accent text-3xl sm:text-4xl text-[#2e2032] tracking-tight"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 text-[15px] leading-relaxed text-[#5b4d5f]"
      >
        {description}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="mt-3 text-sm text-[#8a7288]"
      >
        {count} {count === 1 ? "product" : "products"}
      </motion.p>
    </header>
  );
}
