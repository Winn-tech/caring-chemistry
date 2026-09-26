"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export function EmptyProducts() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-4 py-24 text-center"
    >
      <SearchX className="h-8 w-8 text-[#d0b4bd]" strokeWidth={1.5} />
      <div>
        <p className="text-base font-medium text-[#2e2032]">
          No products match your filters
        </p>
        <p className="mt-1 text-sm text-[#5b4d5f]">
          Try removing a filter or explore everything we carry.
        </p>
      </div>
      <button
        onClick={() => router.push("/shop")}
        className="rounded-md bg-[#2e2032] px-5 py-2.5 text-sm font-medium text-[#f8f4f1] transition-colors hover:bg-[#221826]"
      >
        Clear all filters
      </button>
    </motion.div>
  );
}
