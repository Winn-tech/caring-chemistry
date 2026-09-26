"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../../components/reveal";
import { useNewsletterSubscribe } from "../../hooks/use-newsletter-subscribe";

export function JournalNewsletter() {
  const [email, setEmail] = useState("");
  const { status, subscribe } = useNewsletterSubscribe();
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (await subscribe(email)) setEmail(""); };
  return <section className="bg-primary-950 px-6 py-20 text-white lg:px-10 lg:py-24"><Reveal className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-300">The beauty list</p><h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">A little more care, in your inbox.</h2><p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65">Skincare tips, ingredient guides and gentle reminders for better rituals.</p></div><div className="w-full max-w-xl"><form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="journal-email">Email address</label><input id="journal-email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="min-w-0 flex-1 border-b border-white/35 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-accent-300" />{status === "success" ? <span className="flex items-center px-1 py-3 text-sm text-accent-200">You&apos;re on the list.</span> : <button type="submit" disabled={status === "loading"} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary-950 transition-colors hover:bg-accent-200 disabled:opacity-60">{status === "loading" ? "Joining..." : "Subscribe"} <ArrowUpRight size={16} /></button>}</form>{status === "error" && <p className="mt-3 text-xs text-accent-300" role="alert">We couldn&apos;t complete that. Please try again.</p>}</div></Reveal></section>;
}
