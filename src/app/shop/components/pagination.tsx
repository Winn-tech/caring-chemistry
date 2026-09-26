"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildShopHref } from "@/lib/shop/query";

interface PaginationProps {
  page: number;
  totalPages: number;
}

function getPageNumbers(page: number, totalPages: number): (number | "…")[] {
  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) result.push("…");
    result.push(p);
  });
  return result;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  const pages = getPageNumbers(page, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5 pb-4">
      <Link
        href={buildShopHref(searchParams, { page: page > 1 ? String(page - 1) : null })}
        aria-disabled={page <= 1}
        className={`flex h-9 w-9 items-center justify-center rounded-md border border-[#d8c7ce] transition-colors ${
          page <= 1
            ? "pointer-events-none opacity-40"
            : "hover:border-[#c9b5c1] hover:bg-[#f5efee]"
        }`}
      >
        <ChevronLeft className="h-4 w-4 text-[#4d3d50]" />
      </Link>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-[#a28ca0]">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildShopHref(searchParams, { page: p === 1 ? null : String(p) })}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors ${
              p === page
                ? "bg-[#2e2032] text-[#f8f4f1]"
                : "text-[#4d3d50] hover:bg-[#f5efee]"
            }`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={buildShopHref(searchParams, {
          page: page < totalPages ? String(page + 1) : null,
        })}
        aria-disabled={page >= totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-md border border-[#d8c7ce] transition-colors ${
          page >= totalPages
            ? "pointer-events-none opacity-40"
            : "hover:border-[#c9b5c1] hover:bg-[#f5efee]"
        }`}
      >
        <ChevronRight className="h-4 w-4 text-[#4d3d50]" />
      </Link>
    </nav>
  );
}
