"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SortSelect } from "./sort-select";
import { ActiveFilters } from "./active-filters";
import { MobileFilterSheet } from "../filters/mobile-filter-sheet";
import type { ShopFilters, SortKey } from "@/lib/shop/types";

interface ProductToolbarProps {
  total: number;
  sort: SortKey;
  filters: ShopFilters;
}

function countActive(filters: ShopFilters) {
  return (
    (filters.category?.length ?? 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)
  );
}

export function ProductToolbar({ total, sort, filters }: ProductToolbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCount = countActive(filters);

  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2 rounded-md border border-[#d8c7ce] bg-white px-3.5 py-2 text-sm text-[#2e2032] transition-colors hover:border-[#c9b5c1] lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#2e2032] px-1 text-[10px] text-[#f8f4f1]">
                {activeCount}
              </span>
            )}
          </button>
          <span className="hidden text-sm text-[#5b4d5f] sm:inline">
            {total} {total === 1 ? "product" : "products"}
          </span>
        </div>

        <SortSelect value={sort} />
      </div>

      <ActiveFilters filters={filters} />

      <MobileFilterSheet
        filters={filters}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
