// app/components/new-arrivals.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ProductCardData } from "@/lib/shop/types";
import { Reveal } from "./reveal";

interface NewArrivalsProps {
  products: ProductCardData[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section id="new-arrivals" className="scroll-mt-20 bg-[#F7F3EF] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-accent text-lg italic text-accent-600">Just landed</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              New Arrivals
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop?sort=newest"
              className="hidden text-sm font-semibold text-primary-700 underline-offset-4 hover:text-accent-600 hover:underline sm:inline"
            >
              See everything new →
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Scroll left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-200 text-primary-700 transition-colors hover:border-accent-400 hover:text-accent-600"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Scroll right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-200 text-primary-700 transition-colors hover:border-accent-400 hover:text-accent-600"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={scrollerRef}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group w-[280px] flex-none snap-start"
            >
              <Link
                href={`/product/${product.slug}`}
                className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F3EF]"
              >
                <div className="relative overflow-hidden rounded-2xl bg-primary-100">
                  <div className="relative aspect-[4/5] w-full">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="280px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary-600 via-primary-800 to-primary-950" />
                    )}
                  </div>

                  <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white">
                    New
                  </span>

                  {/* Visual cue only: the whole card is the link. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-3 translate-y-12 rounded-full bg-white/95 py-2.5 text-center text-sm font-semibold text-primary-950 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    View product
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-[22px] font-semibold text-primary-950">{product.name}</h3>
                  {product.descriptor && (
                    <p className="mt-1 line-clamp-2 text-[18px] text-primary-600">{product.descriptor}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
