import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JOURNAL_ARTICLES, type JournalArticle } from "../journal-data";
import { Reveal } from "../../components/reveal";

interface JournalLatestProps {
  query: string;
  category: string;
  concern: string;
}

function ArticleCard({ article, index }: { article: JournalArticle; index: number }) {
  return (
    <Reveal delay={index * 100} className="group">
      <Link href={`/journal/${article.slug}`} className="block">
        <div className="relative aspect-1.25/1 overflow-hidden rounded-lg bg-primary-100">
          <Image src={article.image} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" unoptimized className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        </div>
        <div className="pt-5">
          <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700"><span>{article.category}</span><span className="text-primary-400">{article.readTime}</span></div>
          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-primary-950">{article.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-primary-600">{article.excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-800">Read guide <ArrowUpRight size={15} /></span>
        </div>
      </Link>
    </Reveal>
  );
}

export function JournalLatest({ query, category, concern }: JournalLatestProps) {
  const normalizedQuery = query.trim().toLowerCase();
  const articles = JOURNAL_ARTICLES.filter((article) => {
    const matchesCategory = category === "All" || article.category === category;
    const matchesConcern = !concern || article.concern === concern;
    const matchesQuery = !normalizedQuery || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesConcern && matchesQuery;
  });

  return (
    <section className="bg-[#f8f6f2] px-6 pb-20 lg:px-10 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex items-end justify-between gap-4 border-t border-primary-200 pt-10">
          <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-700">The collection</p><h2 className="mt-3 font-display text-4xl font-semibold text-primary-950">Latest stories</h2></div>
          <span className="text-sm text-primary-500">{articles.length} stories</span>
        </Reveal>
        {articles.length > 0 ? <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article, index) => <ArticleCard key={article.slug} article={article} index={index} />)}</div> : <div className="mt-10 border border-dashed border-primary-300 px-6 py-16 text-center text-sm text-primary-600">No guides found. Try another search or category.</div>}
      </div>
    </section>
  );
}
