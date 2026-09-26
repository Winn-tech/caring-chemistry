import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Reveal } from "../../components/reveal";

export function RoutineBuilder() {
  return <section id="routine-builder" className="bg-accent-100 px-6 py-20 lg:px-10 lg:py-24"><Reveal className="mx-auto max-w-3xl text-center"><Sparkles size={20} className="mx-auto animate-pulse text-accent-700" strokeWidth={1.5} /><p className="mt-5 font-accent text-3xl italic text-accent-800">Not sure what your skin needs?</p><h2 className="mt-3 font-display text-4xl font-semibold text-primary-950 sm:text-5xl">Build a routine that feels like yours.</h2><p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-primary-700">Tell us about your skin and discover a considered starting point, with guidance made for your everyday.</p><Link href="/beauty-guide" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">Discover your routine <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></Reveal></section>;
}
