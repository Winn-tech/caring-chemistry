import { Prisma, ProductStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "./constants";
import type { ParsedShopQuery, ProductCardData, ShopResult, SortKey } from "./types";

type ProductWithCardRelations = Prisma.ProductGetPayload<{ include: { category: true; images: true } }>;

// Sample products are a development aid only; in production a failed query must surface as an error.
const USE_MOCK_FALLBACK = process.env.NODE_ENV !== "production";

function mapProductToCard(product: ProductWithCardRelations): ProductCardData {
  const images = product.images;
  const mainImage = images.find((img) => img.position === 0) ?? images[0] ?? null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    descriptor: product.description ?? null,
    imageUrl: mainImage?.url ?? null,
    hoverImageUrl: images[1]?.url ?? null,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    rating: product.rating ? Number(product.rating) : null,
    reviewCount: product.reviewCount ?? 0,
    badge: product.badge ? (product.badge === "BESTSELLER" ? "BESTSELLER" : "NEW") : null,
    categorySlug: product.category?.slug ?? null,
  };
}

function buildMockProducts(): ProductCardData[] {
  return [
    {
      id: "mock-1",
      slug: "dew-cream-cleanser",
      name: "Dew Cream Cleanser",
      descriptor: "A soft, non-stripping cleanse for comfortable skin.",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
      price: 6800,
      compareAtPrice: 7800,
      rating: 4.8,
      reviewCount: 144,
      badge: "BESTSELLER",
      categorySlug: "cleansers",
    },
    {
      id: "mock-2",
      slug: "peptide-serum",
      name: "Peptide Renewal Serum",
      descriptor: "Targeted support for smoother, brighter-looking skin.",
      imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
      price: 9400,
      compareAtPrice: 11000,
      rating: 4.9,
      reviewCount: 208,
      badge: "NEW",
      categorySlug: "serums",
    },
    {
      id: "mock-3",
      slug: "barrier-balance-cream",
      name: "Barrier Balance Cream",
      descriptor: "Deep hydration without the heavy finish.",
      imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80",
      price: 8800,
      compareAtPrice: 9800,
      rating: 4.7,
      reviewCount: 97,
      badge: "BESTSELLER",
      categorySlug: "moisturizers",
    },
    {
      id: "mock-4",
      slug: "body-butter-ritual",
      name: "Body Butter Ritual",
      descriptor: "Velvety hydration that comforts dry skin after bathing.",
      imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
      price: 7600,
      compareAtPrice: 8700,
      rating: 4.6,
      reviewCount: 71,
      categorySlug: "body-care",
    },
    {
      id: "mock-5",
      slug: "daily-spf-50",
      name: "Daily SPF 50",
      descriptor: "Broad-spectrum defense with a soft, non-greasy feel.",
      imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      price: 11200,
      compareAtPrice: 12600,
      rating: 4.8,
      reviewCount: 182,
      badge: "NEW",
      categorySlug: "essentials",
    },
    {
      id: "mock-6",
      slug: "repair-oil",
      name: "Repair Oil",
      descriptor: "Nourishing facial oil for the final layer in a skin ritual.",
      imageUrl: "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=80",
      price: 9900,
      compareAtPrice: 11800,
      rating: 4.5,
      reviewCount: 68,
      categorySlug: "essentials",
    },
  ];
}

function buildOrderBy(sort: SortKey): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "newest":
      return [{ createdAt: "desc" }];
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "rating":
      return [{ rating: "desc" }, { reviewCount: "desc" }];
    case "best-selling":
      // Flagged best sellers first, then the most-reviewed as a popularity signal.
      return [{ isBestSeller: "desc" }, { reviewCount: "desc" }, { createdAt: "desc" }];
    case "featured":
    default:
      return [{ isBestSeller: "desc" }, { createdAt: "desc" }];
  }
}

function buildWhere(filters: ParsedShopQuery["filters"]): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.ACTIVE,
    deletedAt: null,
  };

  if (filters.category?.length) {
    where.category = { slug: { in: filters.category } };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }

  return where;
}

export async function getProducts(query: ParsedShopQuery): Promise<ShopResult> {
  const where = buildWhere(query.filters);
  const skip = (query.page - 1) * PAGE_SIZE;

  try {
    const [rows, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: buildOrderBy(query.sort),
        skip,
        take: PAGE_SIZE,
        include: {
          category: true,
          images: { orderBy: { position: "asc" } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const products = rows.map(mapProductToCard);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return {
      products,
      total,
      page: query.page,
      pageSize: PAGE_SIZE,
      totalPages,
    };
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    console.warn("Falling back to mock shop data because the product query failed:", error);

    const allProducts = buildMockProducts();
    const filteredProducts = allProducts.filter((product) => {
      const matchesCategory =
        !query.filters.category?.length ||
        query.filters.category.includes(product.categorySlug ?? "");
      const matchesMin =
        query.filters.minPrice === undefined || product.price >= query.filters.minPrice;
      const matchesMax =
        query.filters.maxPrice === undefined || product.price <= query.filters.maxPrice;
      return matchesCategory && matchesMin && matchesMax;
    });

    const total = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const products = filteredProducts.slice(skip, skip + PAGE_SIZE);

    return {
      products,
      total,
      page: query.page,
      pageSize: PAGE_SIZE,
      totalPages,
    };
  }
}

/** Active products as cards, best sellers first — for features that match across the catalogue (e.g. the ritual finder). */
export async function getActiveProductCards(limit = 60): Promise<ProductCardData[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE, deletedAt: null },
      orderBy: buildOrderBy("featured"),
      take: limit,
      include: { category: true, images: { orderBy: { position: "asc" } } },
    });
    return rows.map(mapProductToCard);
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return buildMockProducts();
  }
}

export async function getCatalogSize(): Promise<number> {
  try {
    return await prisma.product.count({
      where: {
        status: ProductStatus.ACTIVE,
        deletedAt: null,
      },
    });
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return buildMockProducts().length;
  }
}
