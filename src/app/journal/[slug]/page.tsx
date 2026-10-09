import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "../../components/announcement-bar";
import { Navbar } from "../../components/navbar";
import { Reveal } from "../../components/reveal";
import { NewsletterModal } from "../../components/newsletter-modal";
import { getPublishedJournalArticle } from "../journal-posts";

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedJournalArticle(slug);

  if (!article) notFound();

  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <article className="bg-[#f8f6f2]">
        <Reveal className="mx-auto max-w-4xl px-6 pb-12 pt-20 text-center lg:px-10 lg:pt-28">
          <Link href="/journal" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-accent-700"><ArrowLeft size={16} /> Back to journal</Link>
          <p className="mt-12 text-xs font-semibold uppercase tracking-[0.22em] text-accent-700">{article.category}</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.96] text-primary-950 sm:text-7xl">{article.title}</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-600">{article.excerpt}</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">{article.readTime} · {article.date}</p>
        </Reveal>
        <Reveal className="relative mx-auto aspect-[1.8/1] max-w-6xl overflow-hidden px-0 sm:rounded-xl" delay={100}>
          <Image src={article.image} alt="" fill sizes="(min-width: 1280px) 1152px, 100vw" unoptimized className="object-cover" priority />
        </Reveal>
        <div className="mx-auto grid max-w-4xl gap-12 px-6 py-16 lg:grid-cols-[9rem_1fr] lg:px-10 lg:py-24">
          <aside className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">In this guide</aside>
          <div className="max-w-2xl space-y-7 text-base leading-[1.9] text-primary-800">
            {article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            <div className="border-t border-primary-200 pt-8">
              <p className="font-accent text-3xl italic text-accent-700">Keep it considered.</p>
              <Link href="/ritual#ritual-finder" className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-950">Build your routine <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
            </div>
          </div>
        </div>
      </article>
      <NewsletterModal trigger="reading" />
    </main>
  );
}
