"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { buildShopHref } from "@/lib/shop/query";
import type { ShopFilters } from "@/lib/shop/types";

interface ProductFiltersProps {
  filters: ShopFilters;
}

const FILTER_GROUPS = {
  skinType: ["Dry", "Oily", "Combination", "Sensitive"],
  concern: ["Dullness", "Acne", "Barrier Repair", "Hydration"],
  productType: ["Cleanser", "Serum", "Moisturizer", "Body Care", "Essentials"],
};

export function ProductFilters({ filters }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleValue = (key: keyof typeof FILTER_GROUPS, value: string) => {
    const current = filters[key] ?? [];
    const nextValues = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    const paramKey =
      key === "skinType" ? "skinType" : key === "concern" ? "concern" : "type";

    router.push(
      buildShopHref(searchParams, {
        [paramKey]: nextValues.length ? nextValues.join(",") : null,
      })
    );
  };

  return (
    <div className="space-y-7 rounded-2xl border border-[#e7dfe5] bg-white p-5">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5b4d5f]">
          Refine by
        </h2>
      </div>

      <div className="space-y-5">
        {Object.entries(FILTER_GROUPS).map(([key, values]) => (
          <div key={key}>
            <p className="mb-3 text-sm font-medium text-[#2e2032]">
              {key === "skinType"
                ? "Skin type"
                : key === "concern"
                  ? "Concern"
                  : "Product type"}
            </p>
            <div className="space-y-2">
              {values.map((value) => {
                const selected = (filters[key as keyof typeof FILTER_GROUPS] ?? []).includes(value);
                return (
                  <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-[#4d3d50]">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleValue(key as keyof typeof FILTER_GROUPS, value)}
                      className="h-4 w-4 accent-[#c88041]"
                    />
                    {value}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-[#2e2032]">Price</p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => router.push(buildShopHref(searchParams, { minPrice: null, maxPrice: null }))}
            className="text-sm text-[#4d3d50] hover:text-[#2e2032]"
          >
            Clear price filters
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-[#4d3d50]">
        <input
          type="checkbox"
          checked={Boolean(filters.inStockOnly)}
          onChange={() =>
            router.push(
              buildShopHref(searchParams, {
                inStock: filters.inStockOnly ? null : "1",
              })
            )
          }
          className="h-4 w-4 accent-[#c88041]"
        />
        In stock only
      </label>
    </div>
  );
}
