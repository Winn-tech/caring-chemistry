// app/components/about/about-cta.tsx
import Link from "next/link";
import { Reveal } from ".././reveal";

export function AboutCta() {
  return (
    <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 py-24 [clip-path:polygon(0_0,100%_12%,100%_100%,0_100%)]">
      <Reveal className="mx-auto max-w-2xl px-6 text-center lg:px-10">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to meet your skin?
        </h2>

        <p className="mt-4 text-sm text-primary-300 sm:text-base">
          Discover products created with intention, not guesswork.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-accent-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          Shop the Collection
        </Link>
      </Reveal>
    </section>
  );
}
