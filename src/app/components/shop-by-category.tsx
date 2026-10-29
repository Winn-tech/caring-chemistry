// app/components/shop-by-category.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryTile } from "@/lib/shop/types";
import { Reveal } from "./reveal";

interface ShopByCategoryProps {
  categories: CategoryTile[];
}

// Product photos are pack shots on white; `mix-blend-multiply` on each photo's wrapper sinks the white
// into the cream stage. It sits on the wrapper because the preview fades and moves it, and an
// element that is fading or moving blends only with itself, which would show the white box.
function CategoryPhoto({ category, sizes }: { category: CategoryTile; sizes: string }) {
  if (!category.imageUrl) return <span aria-hidden="true" className="absolute inset-[22%] rounded-full bg-white/70" />;
  return <Image src={category.imageUrl} alt="" fill sizes={sizes} className="object-contain" />;
}

export function ShopByCategory({ categories }: ShopByCategoryProps) {
  // Which category the large preview shows; follows the pointer and keyboard focus.
  const [active, setActive] = useState(0);

  if (categories.length === 0) return null;

  return (
    <section id="shop-by-category" className="relative isolate scroll-mt-20 overflow-hidden text-white">
      {/* Same wine backdrop as the footer (.hero-luxe + .hero-grain in globals.css). */}
      <div aria-hidden="true" className="hero-luxe absolute inset-0 -z-20" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-10">
        <Reveal once className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent-200">
              <span aria-hidden="true" className="h-px w-10 bg-accent-300" />
              Find your fit
            </p>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.045em] sm:text-7xl">
              <span className="font-light">Shop by</span> <span className="font-bold">Category</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded text-sm font-semibold text-accent-100 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent-200"
          >
            Browse the full range
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-12 sm:mt-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          {/* the index */}
          <ul className="border-t border-white/15">
            {categories.map((category, i) => {
              const isActive = i === active;
              return (
                <li key={category.slug} className="border-b border-white/15">
                  <Link
                    href={`/shop?category=${encodeURIComponent(category.slug)}`}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-5 outline-none focus-visible:bg-white/5 sm:gap-6 sm:py-7"
                  >
                    {/* small thumbnail on phones, where there is no preview panel */}
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#FAF3EE] lg:hidden">
                      <span className="absolute inset-1.5 mix-blend-multiply">
                        <CategoryPhoto category={category} sizes="56px" />
                      </span>
                    </span>
                    <span aria-hidden="true" className={`hidden w-8 text-sm font-semibold tabular-nums transition-colors duration-300 lg:block ${isActive ? "text-accent-200" : "text-white/35"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0">
                      <span
                        className={`block truncate text-3xl font-bold tracking-[-0.035em] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-5xl lg:text-6xl ${
                          isActive ? "text-white lg:translate-x-3" : "text-white/55 group-hover:text-white"
                        }`}
                      >
                        {category.label}
                      </span>
                      <span className="mt-1 block text-sm text-accent-100/70 lg:hidden">
                        {category.productCount} {category.productCount === 1 ? "product" : "products"}
                      </span>
                    </span>

                    <span className="flex items-center gap-5">
                      <span className="hidden text-sm tabular-nums text-accent-100/70 lg:inline">
                        {category.productCount} {category.productCount === 1 ? "product" : "products"}
                      </span>
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-[transform,background-color,color,border-color] duration-500 ${
                          isActive
                            ? "rotate-45 border-accent-200 bg-accent-200 text-[#5c0636]"
                            : "border-white/25 text-white group-hover:border-white"
                        }`}
                      >
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* preview of the highlighted category (desktop) */}
          <div aria-hidden="true" className="relative hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[radial-gradient(110%_80%_at_50%_30%,#FFFDFB_0%,#FAF3EE_55%,#F1E1D6_100%)] shadow-[0_50px_90px_-40px_rgba(20,0,12,0.8)]">
              <span className="absolute left-1/2 top-[42%] aspect-square w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E9D6C8]" />
              <span className="absolute bottom-[19%] left-1/2 h-5 w-[44%] -translate-x-1/2 rounded-full bg-[#5c0636]/15 blur-xl" />
              {categories.map((category, i) => (
                <span
                  key={category.slug}
                  className="absolute inset-x-[15%] bottom-[20%] top-[12%] mix-blend-multiply transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ opacity: i === active ? 1 : 0, transform: i === active ? "translateY(0) scale(1)" : "translateY(1rem) scale(0.96)" }}
                >
                  <CategoryPhoto category={category} sizes="420px" />
                </span>
              ))}
              <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl bg-white/85 px-5 py-4 text-primary-950 backdrop-blur-md">
                <span className="text-lg font-bold tracking-tight">{categories[active].label}</span>
                <span className="text-sm text-primary-900/65">
                  {categories[active].productCount} {categories[active].productCount === 1 ? "product" : "products"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
