"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Reveal } from "./reveal";

interface JournalPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverUrl: string | null;
}

const FALLBACK_POSTS: JournalPost[] = [
  {
    id: "routine",
    slug: "build-a-routine-that-actually-works",
    title: "Build a routine that actually works",
    excerpt: "A thoughtful, step-by-step approach to skin that feels as good as it looks.",
    coverUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "ingredients",
    slug: "five-ingredients-your-skin-will-love",
    title: "Five ingredients your skin will love",
    excerpt: "The quiet achievers worth knowing before you add another product to your shelf.",
    coverUrl: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "morning-night",
    slug: "morning-vs-night-your-routine-explained",
    title: "Morning vs night: your routine, explained",
    excerpt: "What your skin needs when the day begins and when it winds down.",
    coverUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
  },
];

const TOPICS = ["Acne", "Dry skin", "Hyperpigmentation", "Ingredients", "Routines"];

function PostImage({ post, sizes }: { post: JournalPost; sizes: string }) {
  if (!post.coverUrl) {
    return <div className="h-full w-full bg-[linear-gradient(135deg,#d9c5b5,#8c6870)]" />;
  }

  return (
    <Image
      src={post.coverUrl}
      alt=""
      fill
      sizes={sizes}
      unoptimized
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
  );
}

export function BeautyJournal() {
  const [posts, setPosts] = useState(FALLBACK_POSTS);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/blog/posts")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data?: JournalPost[] }) => {
        if (!cancelled && payload.data && payload.data.length > 0) {
          setPosts(payload.data.slice(0, 3));
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const [featured, ...supporting] = posts;

  return (
    <section id="journal" className="overflow-hidden bg-[#f2ede8] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-accent-700">
              <motion.span
                initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Sparkles size={16} strokeWidth={1.5} />
              </motion.span>
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">The Beauty Journal</span>
            </div>
            <h2 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[0.98] tracking-tight text-primary-950 sm:text-6xl">
              Beauty knowledge, made simple.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-primary-600">
              Expert tips, ingredient guides and unhurried rituals to help you get more from your skincare.
            </p>
          </div>
          <Link href="#journal" className="group inline-flex items-center gap-2 border-b border-primary-400 pb-1 text-sm font-semibold text-primary-900 transition-colors hover:border-accent-600 hover:text-accent-700">
            View all guides <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.28fr_0.72fr]">
          <Reveal className="group">
            <Link href={`/journal/${featured.slug}`} className="block">
              <motion.div
                initial={{ clipPath: "inset(10% 0 10% 0 round 0.75rem)", scale: 1.04 }}
                whileInView={{ clipPath: "inset(0% 0 0% 0 round 0.75rem)", scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[1.18/1] overflow-hidden rounded-xl bg-primary-200 sm:aspect-[1.45/1]"
              >
                <PostImage post={featured} sizes="(min-width: 1024px) 58vw, 100vw" />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(27,17,29,.82))] px-6 pb-7 pt-24 text-white sm:px-9 sm:pb-9">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-200">Skincare</p>
                  <h3 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-5xl">{featured.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">{featured.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Read article <ArrowUpRight size={16} /></span>
                </div>
              </motion.div>
            </Link>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {supporting.map((post, index) => (
              <Reveal key={post.id} delay={(index + 1) * 100} className="group">
                <Link href={`/journal/${post.slug}`} className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-4 sm:block lg:grid lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 1.03 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (index + 1) * 0.12 }}
                    className="relative aspect-[1.08/1] overflow-hidden rounded-xl bg-primary-200 sm:aspect-[1.7/1] lg:aspect-[1.08/1]"
                  >
                    <PostImage post={post} sizes="(min-width: 1024px) 24vw, 50vw" />
                  </motion.div>
                  <div className="pt-1 sm:pt-4 lg:pt-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-700">{index === 0 ? "Ingredients" : "Beauty tips"}</p>
                    <h3 className="mt-2 font-display text-xl font-semibold leading-tight text-primary-950 sm:text-2xl">{post.title}</h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700">Read guide <ArrowUpRight size={15} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16 grid items-center gap-7 border-t border-primary-300 pt-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="font-accent text-2xl italic text-accent-700">Find the right routine</p>
            <p className="mt-2 text-sm text-primary-600">Not sure what your skin needs? Start with a guide made for you.</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {TOPICS.map((topic) => <Link key={topic} href={`/journal?topic=${encodeURIComponent(topic.toLowerCase())}`} className="text-sm font-medium text-primary-800 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-accent-700">{topic}</Link>)}
            </div>
          </div>
          <Link href="/beauty-guide" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">Tell us about your skin <ArrowUpRight size={16} /></Link>
        </Reveal>
      </div>
    </section>
  );
}