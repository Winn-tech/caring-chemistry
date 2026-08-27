"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../../components/reveal";

export function JournalNewsletter() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  return <section className="bg-primary-950 px-6 py-20 text-white lg:px-10 lg:py-24"><Reveal className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-300">The beauty list</p><h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">A little more care, in your inbox.</h2><p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65">Skincare tips, ingredient guides and gentle reminders for better rituals.</p></div><form onSubmit={submit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="journal-email">Email address</label><input id="journal-email" required type="email" placeholder="Your email address" className="min-w-0 flex-1 border-b border-white/35 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-accent-300" />{submitted ? <span className="flex items-center px-1 py-3 text-sm text-accent-200">You&apos;re on the list.</span> : <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary-950 transition-colors hover:bg-accent-200">Subscribe <ArrowUpRight size={16} /></button>}</form></Reveal></section>;
}
