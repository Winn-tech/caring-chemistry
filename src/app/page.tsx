// app/page.tsx
import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { AnnouncementBar } from "./components/announcement-bar";
import "./globals.css";
import { BestSellers } from "./components/best-sellers";
import { ShopByCategory } from "./components/shop-by-category";
import { NewArrivals } from "./components/new-arrivals";
import { BrandValues } from "./components/brand-values";
import { BeautyJournal } from "./components/beauty-journal";
import { WhereToBuy } from "./components/where-to-buy";
import { Footer } from "./components/footer";
import { NewsletterModal } from "./components/newsletter-modal";
import { getBestSellers, getCatalogSize, getCategoryTiles, getNewArrivals, getShopCategories } from "@/lib/shop/get-products";
import { getActiveStores, getOnlineRetailers } from "@/lib/where-to-buy";

// Catalogue sections are rebuilt at most every 5 minutes, so admin changes show up without a redeploy.
export const revalidate = 300;

export default async function Home() {
  const [bestSellers, categories, allCategories, catalogSize, newArrivals, retailers, stores] = await Promise.all([
    getBestSellers(),
    getCategoryTiles(),
    getShopCategories(),
    getCatalogSize(),
    getNewArrivals(),
    getOnlineRetailers(),
    getActiveStores(),
  ]);

  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <BestSellers products={bestSellers} />
      <ShopByCategory categories={categories} />
      <BeautyJournal />
      <NewArrivals products={newArrivals} />
      <BrandValues productCount={catalogSize} categoryCount={allCategories.length} storeCount={stores.length} />
      <WhereToBuy retailers={retailers} storeCount={stores.length} />
      <NewsletterModal />
      <Footer/>
    </main>
  );
}
