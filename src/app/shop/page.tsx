import type { Metadata } from "next";
import { AnnouncementBar } from "../components/announcement-bar";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Breadcrumb } from "./components/breadcrumb";
import { ShopHeader } from "./components/shop-header";
import { CategoryNav } from "./components/category-nav";
import { ProductToolbar } from "./components/toolbar/product-toolbar";
import { ProductFilters } from "./components/filters/product-filters";
import { ProductGrid } from "./components/product/product-grid";
import { EmptyProducts } from "./components/empty-products";
import { Pagination } from "./components/pagination";
import { BeautyGuideCta } from "./components/beauty-guide-cta";
import { AiChatCta } from "./components/ai-chat-cta";
import { JournalSection } from "./components/journal-section";
import { NewsletterCta } from "./components/newsletter-cta";
import { parseShopSearchParams } from "@/lib/shop/query";
import { getProducts } from "@/lib/shop/get-products";
import { CATEGORY_NAV } from "@/lib/shop/constants";

export const metadata: Metadata = {
  title: "Shop Skincare & Beauty Essentials | Caring Chemistry",
  description:
    "Discover skincare, body care, and beauty essentials thoughtfully formulated to help you build a simple, effective routine.",
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const rawParams = await searchParams;
  const query = parseShopSearchParams(rawParams);
  const result = await getProducts(query);

  const activeCategory = query.filters.category?.[0] ?? "all";
  const categoryLabel =
    CATEGORY_NAV.find((c) => c.slug === activeCategory)?.label ?? "Shop All";

  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <div className="bg-[#f8f4f1] min-h-screen text-[#2e2032]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Breadcrumb category={activeCategory !== "all" ? categoryLabel : undefined} />

          <ShopHeader
            title={activeCategory === "all" ? "Shop All Beauty" : categoryLabel}
            count={result.total}
            imageUrl="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=80"
          />

          <CategoryNav activeSlug={activeCategory} />

          <ProductToolbar total={result.total} sort={query.sort} filters={query.filters} />

          <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10 lg:items-start">
            <aside className="hidden lg:block lg:sticky lg:top-24">
              <ProductFilters filters={query.filters} />
            </aside>

            <section aria-label="Products" className="min-h-[40vh]">
              {result.products.length > 0 ? (
                <ProductGrid products={result.products} />
              ) : (
                <EmptyProducts />
              )}

              {result.totalPages > 1 && (
                <Pagination page={result.page} totalPages={result.totalPages} />
              )}
            </section>
          </div>

          <BeautyGuideCta />
          <AiChatCta />
          <JournalSection />
          <NewsletterCta />
        </div>
      </div>
      <Footer />
    </main>
  );
}
