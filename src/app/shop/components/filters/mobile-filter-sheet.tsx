"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { buildShopHref } from "@/lib/shop/query";
import type { ShopFilters } from "@/lib/shop/types";

interface MobileFilterSheetProps {
  filters: ShopFilters;
  open: boolean;
  onClose: () => void;
}

const FILTER_GROUPS = {
  skinType: ["Dry", "Oily", "Combination", "Sensitive"],
  concern: ["Dullness", "Acne", "Barrier Repair", "Hydration"],
  productType: ["Cleanser", "Serum", "Moisturizer", "Body Care", "Essentials"],
};

export function MobileFilterSheet({ filters, open, onClose }: MobileFilterSheetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleValue = (key: keyof typeof FILTER_GROUPS, value: string) => {
    const current = filters[key] ?? [];
    const nextValues = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    const paramKey = key === "skinType" ? "skinType" : key === "concern" ? "concern" : "type";
    router.push(
      buildShopHref(searchParams, {
        [paramKey]: nextValues.length ? nextValues.join(",") : null,
      })
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-[#2e2032]/40"
          />

          <motion.aside
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-40 rounded-t-2xl border border-[#e7dfe5] bg-[#f8f4f1] p-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2e2032]">Filters</h2>
              <button
                type="button"
                aria-label="Close" 
                onClick={onClose}
                className="rounded-full border border-[#d8c7ce] p-2 text-[#4d3d50]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {Object.entries(FILTER_GROUPS).map(([key, values]) => (
                <div key={key}>
                  <p className="mb-3 text-sm font-medium text-[#2e2032]">
                    {key === "skinType" ? "Skin type" : key === "concern" ? "Concern" : "Product type"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {values.map((value) => {
                      const selected = (filters[key as keyof typeof FILTER_GROUPS] ?? []).includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleValue(key as keyof typeof FILTER_GROUPS, value)}
                          className={`rounded-full border px-3 py-1.5 text-sm ${
                            selected
                              ? "border-[#2e2032] bg-[#2e2032] text-[#f8f4f1]"
                              : "border-[#d8c7ce] bg-white text-[#4d3d50]"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <label className="flex items-center gap-2 text-sm text-[#4d3d50]">
                <input
                  type="checkbox"
                  checked={Boolean(filters.inStockOnly)}
                  onChange={() => {
                    router.push(
                      buildShopHref(searchParams, {
                        inStock: filters.inStockOnly ? null : "1",
                      })
                    );
                  }}
                  className="h-4 w-4 accent-[#c88041]"
                />
                In stock only
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  router.push("/shop");
                  onClose();
                }}
                className="flex-1 rounded-md border border-[#d8c7ce] px-4 py-2.5 text-sm font-medium text-[#2e2032]"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md bg-[#2e2032] px-4 py-2.5 text-sm font-medium text-[#f8f4f1]"
              >
                Apply
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
