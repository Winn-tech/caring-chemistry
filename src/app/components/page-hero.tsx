// app/components/page-hero.tsx
"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface PageHeroProps {
  /** Current page name shown at the end of the breadcrumb. */
  crumb: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** The image's empty side. Text sits there, and phones crop the image to it. */
  textSide: "left" | "right";
  /** Optional content under the banner, e.g. a scroll cue. */
  children?: ReactNode;
}

/**
 * Shared banner hero for content pages (About, Ritual, Journal): a breadcrumb, then a
 * full-width image in its own 16:9 shape on larger screens, with dark text over the
 * image's plain side.
 */
export function PageHero({ crumb, title, description, imageSrc, imageAlt, textSide, children }: PageHeroProps) {
  const right = textSide === "right";

  return (
    <section className="bg-[#f8f4f1] pb-16 text-[#2e2032]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="pt-5 text-xs">
          <ol className="flex items-center gap-1.5 text-[#6c5d6e]">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="transition-colors hover:text-[#2e2032]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
            </li>
            <li>
              <span aria-current="page" className="text-[#2e2032]">
                {crumb}
              </span>
            </li>
          </ol>
        </nav>

        {/* On larger screens the banner takes the image's own 16:9 shape so nothing is cropped. */}
        <header className="relative mb-8 mt-6 h-102 w-full overflow-hidden rounded-2xl sm:aspect-video sm:h-auto">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className={`object-cover sm:object-center ${right ? "object-right" : "object-left"}`}
          />
          {/* Text sits on the image's plain side, so it uses dark ink rather than white. */}
          <div
            className={`relative flex h-full flex-col justify-center px-6 sm:px-10 lg:px-16 ${
              right ? "items-end text-right" : "items-start text-left"
            }`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="max-w-md font-accent text-4xl tracking-tight text-[#2e2032] sm:text-5xl lg:text-6xl"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
              className="mt-4 hidden max-w-[50%] text-lg leading-relaxed text-[#5b4d5f] sm:block lg:max-w-md"
            >
              {description}
            </motion.p>
          </div>
        </header>

        {children}
      </div>
    </section>
  );
}
