// app/components/shop-by-category.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryTile } from "@/lib/shop/types";
import { Reveal } from "./reveal";

interface ShopByCategoryProps {
  categories: CategoryTile[];
}

export function ShopByCategory({ categories }: ShopByCategoryProps) {
  if (categories.length === 0) return null;

  return (
    <section id="shop-by-category" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal once className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-accent text-lg italic text-accent-600">Find your fit</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-primary-700 underline-offset-4 hover:text-accent-600 hover:underline"
          >
            Shop all products →
          </Link>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.map((category, i) => (
            <li key={category.slug}>
              <Reveal once delay={i * 60}>
                <Link
                  href={`/shop?category=${encodeURIComponent(category.slug)}`}
                  className="group relative block overflow-hidden rounded-2xl bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-4"
                >
                  <div className="relative aspect-[4/5] w-full">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 280px, 50vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary-600 via-primary-800 to-primary-950" />
                    )}
                    {/* Shade under the label keeps white text readable on light photos. */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary-950/80 via-primary-950/30 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
                    <span className="min-w-0">
                      <span className="block font-display text-lg font-semibold leading-tight sm:text-2xl">{category.label}</span>
                      <span className="mt-1 block text-xs text-white/75 sm:text-sm">
                        {category.productCount} {category.productCount === 1 ? "product" : "products"}
                      </span>
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 text-primary-950 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
