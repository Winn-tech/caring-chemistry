import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { Reveal } from "../reveal";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#F7F3EF] pb-20 pt-10 sm:pt-15">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <span className="font-accent text-lg italic text-accent-600">About Us</span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-primary-950 sm:text-5xl lg:text-6xl">
            Beauty, thoughtfully made.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-600 sm:text-lg">
            We believe skincare should be simple, effective, and made with intention - never a routine you have to think too hard about.
          </p>
        </Reveal>
      </div>

      <Reveal delay={200} className="mx-auto mt-14 max-w-5xl px-6 lg:px-10">
        <div className="about-hero-panel aspect-video w-full rounded-2xl bg-linear-to-br from-primary-500 via-primary-700 to-primary-950" />
      </Reveal>

      <Reveal delay={350} className="mt-10 flex justify-center">
        <Link
          href="#our-story"
          className="about-scroll-cue flex items-center gap-2 text-sm font-medium text-primary-500 transition-colors hover:text-accent-600"
        >
          Our Story
          <ArrowDown size={15} />
        </Link>
      </Reveal>
    </section>
  );
}