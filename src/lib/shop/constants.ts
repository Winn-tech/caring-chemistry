import type { SortKey } from "./types";

export const PAGE_SIZE = 12;

export const PRICE_BOUNDS = {
  min: 0,
  max: 50000,
};

export const CATEGORY_NAV = [
  { slug: "all", label: "All" },
  { slug: "cleansers", label: "Cleansers" },
  { slug: "serums", label: "Serums" },
  { slug: "moisturizers", label: "Moisturizers" },
  { slug: "body-care", label: "Body Care" },
  { slug: "essentials", label: "Essentials" },
] as const;

/** Real categories (without the "All" pseudo-entry), for filter checkboxes and labels. */
export const CATEGORY_FILTERS = CATEGORY_NAV.filter((category) => category.slug !== "all");

export function categoryLabel(slug: string) {
  return CATEGORY_NAV.find((category) => category.slug === slug)?.label ?? slug;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}
