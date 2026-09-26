export type SortKey =
  | "featured"
  | "newest"
  | "best-selling"
  | "price-asc"
  | "price-desc"
  | "rating";

export interface ShopFilters {
  category?: string[];
  productType?: string[];
  skinType?: string[];
  concern?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

export type ShopSearchParams = Record<string, string | undefined>;

export interface ParsedShopQuery {
  sort: SortKey;
  page: number;
  filters: ShopFilters;
}

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  descriptor?: string | null;
  imageUrl?: string | null;
  hoverImageUrl?: string | null;
  price: number;
  compareAtPrice?: number | null;
  rating?: number | null;
  reviewCount: number;
  badge?: "NEW" | "BESTSELLER" | null;
  inStock: boolean;
  categorySlug?: string | null;
}

export interface ShopResult {
  products: ProductCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
