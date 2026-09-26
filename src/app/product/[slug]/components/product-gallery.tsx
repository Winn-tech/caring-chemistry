"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2 } from "lucide-react";

type ProductImage = { id: string; url: string; alt: string };

export function ProductGallery({ name, images }: { name: string; images: ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  if (!activeImage) {
    return (
      <div className="flex aspect-4/5 items-center justify-center bg-[#eee4df] text-center text-sm text-[#806d78]">
        Product image coming soon
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-28">
      <div className="group relative aspect-4/5 overflow-hidden bg-[#eee4df]">
        <Image
          src={activeImage.url}
          alt={activeImage.alt || name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
        />
        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-white/90 text-[#2e2032] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
          <Maximize2 size={16} />
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative h-20 w-16 flex-none overflow-hidden bg-[#eee4df] focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 ${activeIndex === index ? "ring-2 ring-accent-600 ring-offset-2" : "opacity-65 hover:opacity-100"}`}
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}