import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { JournalArticle } from "../journal-data";
import { Reveal } from "../../components/reveal";

export function IngredientSpotlight({ article }: { article: JournalArticle }) {
  return (
    <section id="ingredient-spotlight" className="px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="group relative aspect-[1.05/1] overflow-hidden rounded-lg"><Image src={article.image} alt="" fill sizes="(min-width: 1024px) 35vw, 100vw" unoptimized className="object-cover transition-transform duration-1000 group-hover:scale-105" /></Reveal>
        <Reveal delay={160}><p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-700">Ingredient spotlight</p><h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-primary-950 sm:text-5xl">{article.title}</h2><p className="mt-5 text-sm leading-relaxed text-primary-600">{article.excerpt}</p><Link href={`/journal/${article.slug}`} className="group mt-7 inline-flex items-center gap-2 border-b border-primary-400 pb-2 text-sm font-semibold text-primary-900 hover:border-accent-600 hover:text-accent-700">Explore the story <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></Reveal>
      </div>
    </section>
  );
}
