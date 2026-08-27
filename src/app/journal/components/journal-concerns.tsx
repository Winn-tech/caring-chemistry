import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JOURNAL_CONCERNS } from "../journal-data";
import { Reveal } from "../../components/reveal";

export function JournalConcerns() {
  return (
    <section className="bg-primary-100 px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal><p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-700">Explore by concern</p><h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight text-primary-950 sm:text-5xl">What are you looking to improve?</h2></Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{JOURNAL_CONCERNS.map((concern, index) => <Reveal key={concern.query} delay={index * 90}><Link href={`/journal?concern=${concern.query}`} className="group flex min-h-40 flex-col justify-between rounded-lg bg-[#f8f6f2] p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-primary-950 hover:text-white hover:shadow-xl"><span className="font-display text-2xl font-semibold">{concern.label}</span><span className="flex items-end justify-between gap-3 text-sm text-primary-500 transition-colors group-hover:text-white/65"><span>{concern.description}</span><ArrowUpRight size={18} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" /></span></Link></Reveal>)}</div>
      </div>
    </section>
  );
}
