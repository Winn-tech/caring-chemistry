"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { buildShopHref } from "@/lib/shop/query";
import { formatNaira } from "@/lib/shop/constants";
import type { ShopFilters } from "@/lib/shop/types";

interface Chip {
  key: string;
  label: string;
  remove: () => Record<string, string | null>;
}

interface ActiveFiltersProps {
  filters: ShopFilters;
}

const PARAM_MAP: Record<"category" | "productType" | "skinType" | "concern", string> = {
  category: "category",
  productType: "type",
  skinType: "skinType",
  concern: "concern",
};

export function ActiveFilters({ filters }: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const chips: Chip[] = [];

  (["category", "productType", "skinType", "concern"] as const).forEach((group) => {
    filters[group]?.forEach((value) => {
      chips.push({
        key: `${group}:${value}`,
        label: value,
        remove: () => {
          const remaining = (filters[group] ?? []).filter((v) => v !== value);
          return { [PARAM_MAP[group]]: remaining.length ? remaining.join(",") : null };
        },
      });
    });
  });

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice ?? 0;
    const max = filters.maxPrice;
    chips.push({
      key: "price",
      label: max ? `${formatNaira(min)} – ${formatNaira(max)}` : `From ${formatNaira(min)}`,
      remove: () => ({ minPrice: null, maxPrice: null }),
    });
  }

  if (filters.inStockOnly) {
    chips.push({
      key: "inStock",
      label: "In Stock",
      remove: () => ({ inStock: null }),
    });
  }

  if (chips.length === 0) return null;

  function clearAll() {
    router.push("/shop");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.button
            key={chip.key}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={() => router.push(buildShopHref(searchParams, chip.remove()))}
            className="group flex items-center gap-1.5 rounded-full border border-[#d8c7ce] bg-[#f5efee] px-3 py-1.5 text-xs text-[#2e2032] transition-colors hover:border-[#c9b5c1]"
          >
            {chip.label}
            <X className="h-3 w-3 text-[#5b4d5f] transition-colors group-hover:text-[#2e2032]" />
          </motion.button>
        ))}
      </AnimatePresence>
      <button
        onClick={clearAll}
        className="text-xs text-[#5b4d5f] underline underline-offset-2 transition-colors hover:text-[#2e2032]"
      >
        Clear all
      </button>
    </div>
  );
}
