import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { JournalArticle } from "../journal-data";
import { Reveal } from "../../components/reveal";

export function JournalFeatured({ article }: { article: JournalArticle }) {
  return (
    <section className="px-6 py-16 lg:px-10 lg:py-24">
      <Reveal animated={false} className="mx-auto mb-8 flex max-w-7xl items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-700">Featured story</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary-950 sm:text-4xl">A considered place to begin.</h2>
        </div>
        <span className="hidden text-sm text-primary-500 sm:block">{article.readTime}</span>
      </Reveal>
      <Reveal animated={false} className="mx-auto grid max-w-7xl overflow-hidden rounded-xl bg-primary-950 lg:grid-cols-[1.12fr_0.88fr]" delay={100}>
        <div className="relative min-h-80 lg:min-h-136">
          <Image src={article.image} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" unoptimized className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-7 py-10 text-white sm:px-12 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-300">{article.category}</p>
          <h3 className="mt-5 font-display text-4xl font-semibold leading-[0.98] sm:text-5xl">{article.title}</h3>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">{article.excerpt}</p>
          <Link href={`/journal/${article.slug}`} className="group mt-8 inline-flex w-fit items-center gap-2 border-b border-white/40 pb-2 text-sm font-semibold transition-colors hover:border-accent-300 hover:text-accent-200">Read the story <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
        </div>
      </Reveal>
    </section>
  );
}
