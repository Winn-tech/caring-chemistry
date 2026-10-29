// app/components/best-sellers.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductCardData } from "@/lib/shop/types";
import { Reveal } from "./reveal";

interface BestSellersProps {
  products: ProductCardData[];
}

// Soft pastel "stages" the product photos sit on, one per product in turn.
const STAGES = ["#F6E1E9", "#F3E7DA", "#ECE5F1", "#F6E4D8", "#E5EEE8"];

// Product photos are pack shots on white. Each photo's wrapper uses `mix-blend-multiply`, which
// drops the white into the stage colour behind it, so the product looks photographed on that tint.
// The blend sits on the wrapper, not the image: the wrapper moves on hover, and a moving element
// blends only with itself, which would show the white box again.
function ProductPhoto({ product, sizes, className = "" }: { product: ProductCardData; sizes: string; className?: string }) {
  if (!product.imageUrl) {
    return <span aria-hidden="true" className="block h-full w-full rounded-full bg-white/60" />;
  }
  return (
    <Image
      src={product.imageUrl}
      alt=""
      fill
      sizes={sizes}
      className={`object-contain ${className}`}
    />
  );
}

export function BestSellers({ products }: BestSellersProps) {
  if (products.length === 0) return null;

  const [featured, ...rest] = products;

  return (
    <section id="best-sellers" className="relative scroll-mt-20 overflow-hidden bg-[#F7F3EF] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal once className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent-700">
              <span aria-hidden="true" className="h-px w-10 bg-accent-500" />
              Fan favourites
            </p>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.045em] text-primary-950 sm:text-7xl">
              <span className="font-light">Best</span> <span className="font-bold">Sellers</span>
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="text-base leading-relaxed text-primary-900/75">
              The products our customers keep coming back for. Start here if you&apos;re new to Caring Chemistry.
            </p>
            <Link
              href="/shop"
              className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-950 underline-offset-4 hover:underline"
            >
              Shop all products
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <div className={`mt-12 grid gap-5 sm:mt-16 lg:gap-6 ${rest.length > 0 ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" : ""}`}>
          {/* featured product */}
          <Reveal once>
            <Link
              href={`/product/${featured.slug}`}
              className="group relative isolate flex aspect-[3/4] h-full flex-col overflow-hidden rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-primary-950 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F3EF] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[38rem]"
              style={{ background: `radial-gradient(120% 90% at 50% 35%, #ffffff 0%, ${STAGES[0]} 55%, #EFCFDC 100%)` }}
            >
              {/* halo rings behind the product */}
              <span aria-hidden="true" className="absolute left-1/2 top-[42%] -z-10 aspect-square w-[78%] max-w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80" />
              <span aria-hidden="true" className="absolute left-1/2 top-[42%] -z-10 aspect-square w-[56%] max-w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55" />

              <span className="absolute left-5 top-5 rounded-full bg-white/85 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-950 backdrop-blur-md sm:left-7 sm:top-7">
                Customer favourite
              </span>

              {/* product, lifting slightly on hover over a soft floor shadow */}
              <span aria-hidden="true" className="absolute bottom-[33%] left-1/2 h-6 w-[42%] -translate-x-1/2 rounded-full bg-primary-950/15 blur-xl transition-all duration-700 ease-out group-hover:w-[34%] group-hover:opacity-70 sm:bottom-[27%]" />
              <span className="absolute inset-x-[14%] bottom-[34%] top-[13%] mix-blend-multiply sm:bottom-[24%] sm:top-[12%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3 group-hover:scale-[1.02]">
                <ProductPhoto product={featured} sizes="(min-width: 1024px) 560px, 90vw" />
              </span>

              <span className="mx-4 mb-4 mt-auto flex items-end justify-between gap-4 rounded-[1.5rem] bg-white/80 p-5 backdrop-blur-md sm:mx-6 sm:mb-6 sm:p-6">
                <span className="min-w-0">
                  <span className="block text-xl font-bold leading-tight tracking-tight text-primary-950 sm:text-2xl">{featured.name}</span>
                  {featured.descriptor && (
                    <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-primary-900/70">{featured.descriptor}</span>
                  )}
                </span>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-950 text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={20} aria-hidden="true" />
                  <span className="sr-only">View product</span>
                </span>
              </span>
            </Link>
          </Reveal>

          {/* the rest */}
          {rest.length > 0 && (
            <ul className="flex flex-col gap-4 lg:gap-5">
              {rest.map((product, i) => (
                <li key={product.id} className="flex-1">
                  <Reveal once delay={(i + 1) * 90} className="h-full">
                    <Link
                      href={`/product/${product.slug}`}
                      className="group flex h-full items-center gap-4 rounded-[1.75rem] border border-white bg-white/55 p-3 pr-5 outline-none transition-[background-color,box-shadow] duration-500 hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(46,32,50,0.35)] focus-visible:ring-2 focus-visible:ring-primary-950 sm:gap-6 sm:p-4 sm:pr-7"
                    >
                      <span
                        className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-[1.25rem] sm:w-32 lg:w-36"
                        style={{ backgroundColor: STAGES[(i + 1) % STAGES.length] }}
                      >
                        <span className="absolute inset-[10%] mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-105">
                          <ProductPhoto product={product} sizes="160px" />
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-primary-950 sm:text-lg">{product.name}</span>
                        {product.descriptor && (
                          <span className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-primary-900/65">{product.descriptor}</span>
                        )}
                      </span>
                      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-200 text-primary-950 transition-[transform,background-color,color,border-color] duration-500 group-hover:rotate-45 group-hover:border-primary-950 group-hover:bg-primary-950 group-hover:text-white sm:flex">
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
