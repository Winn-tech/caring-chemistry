"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { buildShopHref } from "@/lib/shop/query";
import { CATEGORY_FILTERS } from "@/lib/shop/constants";
import type { ShopFilters } from "@/lib/shop/types";

interface ProductFiltersProps {
  filters: ShopFilters;
}

export function ProductFilters({ filters }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleCategory = (slug: string) => {
    const current = filters.category ?? [];
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    router.push(buildShopHref(searchParams, { category: next.length ? next.join(",") : null }));
  };

  return (
    <div className="space-y-7 rounded-2xl border border-[#e7dfe5] bg-white p-5">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5b4d5f]">
          Refine by
        </h2>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[#2e2032]">Category</p>
        <div className="space-y-2">
          {CATEGORY_FILTERS.map((category) => (
            <label key={category.slug} className="flex cursor-pointer items-center gap-2 text-sm text-[#4d3d50]">
              <input
                type="checkbox"
                checked={(filters.category ?? []).includes(category.slug)}
                onChange={() => toggleCategory(category.slug)}
                className="h-4 w-4 accent-[#c88041]"
              />
              {category.label}
            </label>
          ))}
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
