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
  /** The image's empty side, where the text sits. */
  textSide: "left" | "right";
  /**
   * Which side of the image phones keep when they crop it to the banner's narrower shape.
   * Defaults to `textSide`; set it to the subject's side to keep the person in view instead.
   */
  mobileFocus?: "left" | "right";
  /** Optional content under the banner, e.g. a scroll cue. */
  children?: ReactNode;
}

/**
 * Shared banner hero for content pages (About, Ritual, Journal): a breadcrumb, then a
 * full-width image in its own 16:9 shape on larger screens, with dark text over the
 * image's plain side.
 */
export function PageHero({ crumb, title, description, imageSrc, imageAlt, textSide, mobileFocus = textSide, children }: PageHeroProps) {
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
            className={`object-cover sm:object-center ${mobileFocus === "right" ? "object-right" : "object-left"}`}
          />
          {/* Phones only: the title is white there, so a soft shade behind the title's side keeps it
              readable on these light images. Larger screens show the image unshaded. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 from-black/55 via-black/25 to-transparent sm:hidden ${right ? "bg-linear-to-l" : "bg-linear-to-r"}`}
          />
          {/* From tablet width up the text sits on the image's plain side, so it uses dark ink. */}
          <div
            className={`relative flex h-full flex-col justify-center px-6 sm:px-10 lg:px-16 ${
              right ? "items-end text-right" : "items-start text-left"
            }`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="max-w-md font-accent text-4xl tracking-tight text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] sm:text-5xl sm:text-[#2e2032] sm:[text-shadow:none] lg:text-6xl"
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
