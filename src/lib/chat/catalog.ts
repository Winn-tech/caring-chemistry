import { PostStatus, ProductStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// Active products and published journal articles go into the assistant's
// instructions so it can match customer needs against them. That is cheap while
// both lists are small; past a few hundred entries, switch to a search tool.
const MAX_PRODUCTS = 150;
const MAX_ARTICLES = 100;
const MAX_SUMMARY_CHARS = 400;
const CACHE_TTL_MS = 5 * 60 * 1000;

function cached(load: () => Promise<string>) {
  let entry: { text: string; expiresAt: number } | null = null;
  return async () => {
    if (entry && entry.expiresAt > Date.now()) return entry.text;
    entry = { text: await load(), expiresAt: Date.now() + CACHE_TTL_MS };
    return entry.text;
  };
}

function summarize(text: string) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_>`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SUMMARY_CHARS);
}

export const getCatalogForAssistant = cached(async () => {
  const products = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE, deletedAt: null },
    select: {
      name: true,
      slug: true,
      description: true,
      isBestSeller: true,
      category: { select: { name: true } },
    },
    orderBy: [{ isBestSeller: "desc" }, { createdAt: "desc" }],
    take: MAX_PRODUCTS,
  });

  // Prices are deliberately left out: products are sold through retail partners, whose prices
  // vary, and the product pages do not show one either.
  return products
    .map((p) => {
      const description = summarize(p.description ?? "") || "No description provided.";
      const bestSeller = p.isBestSeller ? " | BEST SELLER" : "";
      return `- ${p.name} | link: /product/${p.slug} | category: ${p.category.name}${bestSeller}\n  ${description}`;
    })
    .join("\n");
});

export const getArticlesForAssistant = cached(async () => {
  const posts = await prisma.blogPost.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: { title: true, slug: true, category: true, excerpt: true, content: true },
    orderBy: { publishedAt: "desc" },
    take: MAX_ARTICLES,
  });

  return posts
    .map((post) => {
      const summary = summarize(post.excerpt || post.content);
      return `- ${post.title} | link: /journal/${post.slug} | category: ${post.category}\n  ${summary}`;
    })
    .join("\n");
});
