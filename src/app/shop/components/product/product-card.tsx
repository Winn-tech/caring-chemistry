"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { ProductCardData } from "@/lib/shop/types";

interface ProductCardProps {
  product: ProductCardData;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-[#f0e7e3]">
          <div className="relative aspect-[3/4] w-full">
            {product.imageUrl ? (
              <>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  priority={priority}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                />
                {product.hoverImageUrl && (
                  <Image
                    src={product.hoverImageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="absolute inset-0 object-cover opacity-0 transition duration-500 ease-out group-hover:opacity-100"
                  />
                )}
              </>
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#f5d8c5] via-[#e8d3ea] to-[#d5c5d2]" />
            )}

            {product.badge && (
              <span className="absolute left-3 top-3 rounded-full bg-[#c88041] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#fffaf6]">
                {product.badge === "BESTSELLER" ? "Bestseller" : "New"}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-4">
        {product.rating !== null && product.rating !== undefined && (
          <div className="flex items-center gap-1 text-[#c88041]">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-[11px] font-medium text-[#5b4d5f]">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        <Link href={`/product/${product.slug}`} className="mt-2 block">
          <h3 className="font-display text-xl font-semibold text-[#2e2032]">
            {product.name}
          </h3>
        </Link>

        {product.descriptor && (
          <p className="mt-1 line-clamp-2 text-base text-[#6d5568]">{product.descriptor}</p>
        )}
      </div>
    </article>
  );
}
