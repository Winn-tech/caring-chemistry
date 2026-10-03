import { PRICE_BOUNDS } from "./constants";
import type { ParsedShopQuery, ShopSearchParams, SortKey } from "./types";

const VALID_SORTS: SortKey[] = [
  "featured",
  "newest",
  "best-selling",
  "price-asc",
  "price-desc",
  "rating",
];

function splitParam(value?: string): string[] | undefined {
  if (!value) return undefined;
  const parts = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
}

function clampPrice(value: number | undefined, fallback: number) {
  if (value === undefined || Number.isNaN(value)) return fallback;
  return Math.min(Math.max(value, PRICE_BOUNDS.min), PRICE_BOUNDS.max);
}

export function parseShopSearchParams(
  params: ShopSearchParams
): ParsedShopQuery {
  const sort = VALID_SORTS.includes(params.sort as SortKey)
    ? (params.sort as SortKey)
    : "featured";

  const pageNum = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  const minPrice = clampPrice(
    params.minPrice ? Number.parseInt(params.minPrice, 10) : undefined,
    PRICE_BOUNDS.min
  );
  const maxPrice = clampPrice(
    params.maxPrice ? Number.parseInt(params.maxPrice, 10) : undefined,
    PRICE_BOUNDS.max
  );

  return {
    sort,
    page,
    filters: {
      category: splitParam(params.category),
      minPrice: minPrice > PRICE_BOUNDS.min ? minPrice : undefined,
      maxPrice: maxPrice < PRICE_BOUNDS.max ? maxPrice : undefined,
      inStockOnly: params.inStock === "1",
    },
  };
}

export function buildShopHref(
  current: URLSearchParams,
  patch: Record<string, string | null>
) {
  const next = new URLSearchParams(current.toString());

  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }

  if (!("page" in patch)) {
    next.delete("page");
  }

  const qs = next.toString();
  return qs ? `/shop?${qs}` : "/shop";
}
