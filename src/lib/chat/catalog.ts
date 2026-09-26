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

function formatPrice(value: unknown, currency: string) {
  const amount = Number(value);
  return currency === "NGN" ? `₦${amount.toLocaleString("en-NG")}` : `${currency} ${amount.toFixed(2)}`;
}

export const getCatalogForAssistant = cached(async () => {
  const products = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE, deletedAt: null },
    select: {
      name: true,
      slug: true,
      description: true,
      price: true,
      currency: true,
      stock: true,
      isBestSeller: true,
      category: { select: { name: true } },
    },
    orderBy: [{ isBestSeller: "desc" }, { createdAt: "desc" }],
    take: MAX_PRODUCTS,
  });

  return products
    .map((p) => {
      const description = summarize(p.description ?? "") || "No description provided.";
      const availability = p.stock > 0 ? "in stock" : "OUT OF STOCK";
      const bestSeller = p.isBestSeller ? " | BEST SELLER" : "";
      return `- ${p.name} | link: /product/${p.slug} | category: ${p.category.name} | ${formatPrice(p.price, p.currency)} | ${availability}${bestSeller}\n  ${description}`;
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
