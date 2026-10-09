import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ShieldCheck, Star, Truck } from "lucide-react";
import { ProductStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductCardData } from "@/lib/shop/types";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { Reveal } from "@/app/components/reveal";
import { Breadcrumb } from "@/app/shop/components/breadcrumb";
import { ProductCard } from "@/app/shop/components/product/product-card";
import { getPublishedJournalArticles } from "@/app/journal/journal-posts";
import { ProductGallery } from "./components/product-gallery";
import { ProductDetails } from "./components/product-details";
import { ProductWhereToBuy } from "./components/product-where-to-buy";

type PageProps = { params: Promise<{ slug: string }> };

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: ProductStatus.ACTIVE, deletedAt: null },
    include: { category: true, images: { orderBy: { position: "asc" } } },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Product not found | Caring Chemistry" };
  return {
    title: `${product.name} | Caring Chemistry`,
    description: product.description ?? `Discover ${product.name} from Caring Chemistry.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      type: "website",
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

function toCardData(
  product: Awaited<ReturnType<typeof getProduct>> extends infer T ? Exclude<T, null> : never,
): ProductCardData {
  const image = product.images[0];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    descriptor: product.description,
    imageUrl: image?.url ?? null,
    hoverImageUrl: product.images[1]?.url ?? null,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    rating: product.rating ? Number(product.rating) : null,
    reviewCount: product.reviewCount,
    badge: product.badge,
    categorySlug: product.category.slug,
  };
}

const TRUST_POINTS = [
  { icon: Check, label: "Thoughtfully considered care" },
  { icon: Check, label: "Designed for everyday ritual" },
  { icon: ShieldCheck, label: "Verified retail partners" },
  { icon: Truck, label: "Delivery via Jumia and partner stores" },
];

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, status: ProductStatus.ACTIVE, deletedAt: null },
    include: { category: true, images: { orderBy: { position: "asc" }, take: 2 } },
    orderBy: [{ isBestSeller: "desc" }, { createdAt: "desc" }],
    take: 4,
  });

  const productImages = product.images.map((image) => ({
    id: image.id,
    url: image.url,
    alt: image.alt ?? product.name,
  }));
  const journalArticles = await getPublishedJournalArticles();
  const article = journalArticles.find((entry) => entry.concern === product.category.slug) ?? journalArticles[0] ?? null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: productImages.map((image) => image.url),
    sku: product.id,
    brand: { "@type": "Brand", name: "Caring Chemistry" },
    ...(product.rating !== null
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: Number(product.rating), reviewCount: product.reviewCount } }
      : {}),
  };

  return (
    <main className="bg-[#fffaf6] text-[#2e2032]">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="mx-auto max-w-7xl text-[25px] px-6 lg:px-10">
        <Breadcrumb category={product.category.name} />

        {/* Hero: gallery + details */}
        <section className="grid gap-12 pb-20 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:pt-12">
          <Reveal>
            <ProductGallery name={product.name} images={productImages} />
          </Reveal>

          <Reveal delay={120} className="flex flex-col justify-center">
            <p className="font-accent text-lg italic text-accent-700">{product.category.name}</p>

            <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-primary-950 sm:text-5xl">
              {product.name}
            </h1>

            {product.description && (
              <p className="mt-6 max-w-lg text-[17px] leading-7 text-[#6e5b69]">{product.description}</p>
            )}

            {product.rating !== null && (
              <a href="#reviews" className="mt-6 flex w-fit items-center gap-2 text-sm text-[#574454] underline-offset-4 hover:underline">
                <span className="flex gap-0.5 text-accent-600" aria-label={`${Number(product.rating).toFixed(1)} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={15} fill={index < Math.round(Number(product.rating)) ? "currentColor" : "none"} />
                  ))}
                </span>
                <span>
                  {Number(product.rating).toFixed(1)} &middot; {product.reviewCount} reviews
                </span>
              </a>
            )}

            <ul className="mt-8 grid gap-3 border-y border-[#e7dbd9] py-6 text-sm text-[#5f4b5b] sm:grid-cols-2">
              {TRUST_POINTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <Icon size={16} className="shrink-0 text-accent-700" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* Feature strip */}

        <Reveal delay={40}>
          <ProductWhereToBuy productId={product.id} productName={product.name} />
        </Reveal>

        <Reveal>
          <section className="grid gap-8 border-y mt-2 border-[#e7dbd9] py-12 sm:grid-cols-3 sm:gap-6">
            {[
              { title: "A considered formula", body: "Made to fit a thoughtful daily ritual." },
              { title: "Clear, simple care", body: "Straightforward details to help you choose well." },
              { title: "Made for your shelf", body: "A beautiful addition to an unhurried routine." },
            ].map((item, index) => (
              <div key={item.title} className={index > 0 ? "sm:border-l sm:border-[#e7dbd9] sm:pl-6" : ""}>
                <p className="font-display text-2xl font-semibold text-primary-950">{item.title}</p>
                <p className="mt-2 text-lg leading-6 text-[#735e6d]">{item.body}</p>
              </div>
            ))}
          </section>
        </Reveal>

        

        {/* Details */}
        <Reveal>
          <section className="grid gap-12 border-t border-[#e7dbd9] py-20 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-accent text-lg italic text-accent-700">The details</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-primary-950">Know your ritual.</h2>
            </div>
            <ProductDetails description={product.description} category={product.category.name}/>
          </section>
        </Reveal>

        {/* Reviews */}
        <section id="reviews" className="border-t border-[#e7dbd9] py-20">
          <p className="font-accent text-xl italic text-accent-700">Customer notes</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary-950">What people are saying</h2>
          <div className="mt-8 rounded-2xl border border-dashed border-[#cdbbc1] px-6 py-10 text-center text-sm text-[#735e6d]">
            Reviews will appear here as customers share their experience with this product.
          </div>
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-[#e7dbd9] py-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-accent text-xl italic text-accent-700">Continue exploring</p>
                <h2 className="mt-2 font-display text-4xl font-semibold text-primary-950">You may also like</h2>
              </div>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hidden items-center gap-2 text-sm font-semibold text-primary-800 transition-colors hover:text-accent-700 sm:flex"
              >
                Shop the collection <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={toCardData(item)} />
              ))}
            </div>
          </section>
        )}

        {/* Journal CTA */}
        {article && <section className="grid gap-8 border-t border-[#e7dbd9] py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-accent text-xl italic text-accent-700">From the journal</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary-950">
              A little more knowledge for your ritual.
            </h2>
          </div>
          <Link
            href={`/journal/${article.slug}`}
            className="group relative block overflow-hidden rounded-2xl bg-[#eee4df]"
          >
            <div className="relative aspect-2/1">
              <Image
                src={article.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#2e2032]/85 to-transparent px-6 pb-5 pt-16 text-white">
              <p className="font-accent text-sm italic text-accent-200">{article.category}</p>
              <p className="mt-2 font-display text-2xl font-semibold">{article.title}</p>
            </div>
          </Link>
        </section>}
      </div>

      <Footer />
    </main>
  );
}
