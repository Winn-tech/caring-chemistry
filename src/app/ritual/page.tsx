import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Plus } from "lucide-react";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { RitualFinder } from "./components/ritual-finder";
import { RitualRoutine } from "./components/ritual-routine";
import { RitualReveal } from "./components/ritual-reveal";
import styles from "./ritual.module.css";

export const metadata: Metadata = {
  title: "Your daily ritual | Caring Chemistry",
  description: "Less guesswork. More care. Explore morning and evening skincare steps and find a simple starting point for your skin.",
};

const ingredients = [
  { number: "01", name: "Hyaluronic acid", note: "The moisture magnet", description: "A humectant that helps attract water to the skin, leaving it feeling hydrated and comfortable.", tag: "Hydration" },
  { number: "02", name: "Ceramides", note: "A little barrier support", description: "Lipids naturally found in skin that help support its protective barrier and keep moisture in.", tag: "Barrier care" },
  { number: "03", name: "Niacinamide", note: "The versatile essential", description: "A form of vitamin B3 used to support the skin barrier and improve the look of uneven tone.", tag: "Balance" },
];
const faqs = [
  { question: "Do I really need every step?", answer: "No. A gentle cleanser, moisturizer and morning sun protection are a useful starting point. Treatments are optional: add one only when it suits your skin and follow the product instructions." },
  { question: "What order should I apply my products in?", answer: "Start with cleansing, then apply any treatment according to its directions, followed by moisturizer. Broad-spectrum SPF 30 or higher is the final skincare step in the morning. Follow its label for application and reapplication." },
  { question: "How do I introduce something new?", answer: "Introduce one product at a time and patch test as directed. Give yourself time to notice how your skin responds. Stop using a product if it causes irritation, and speak with a dermatologist about persistent concerns." },
  { question: "What if my skin feels sensitive?", answer: "Keep your routine simple and choose gentle, fragrance-free options where possible. Avoid adding several active ingredients at once. A dermatologist can help you find a routine for ongoing sensitivity or a skin condition." },
];

export default function RitualPage() {
  return (
    <div className={`${styles.page} bg-[#f9f5f2] text-[#30232d]`}>
      <Navbar />
      <main>
        <section className="relative mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-8 lg:px-10 lg:pb-20 lg:pt-12" aria-labelledby="ritual-heading">
          <p className="mb-8 text-xs text-[#766571]"><Link href="/" className="hover:text-primary-950">Home</Link><span className="mx-3" aria-hidden="true">/</span>Your daily ritual</p>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <RitualReveal>
              <p className={styles.eyebrow}><span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary-700" />Small moments. Lasting care.</p>
              <h1 id="ritual-heading" className="mt-6 font-display text-[clamp(3.2rem,7vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">Less routine.<br />More <span className="font-accent font-normal italic text-primary-950">ritual.</span></h1>
              <p className="mt-7 max-w-md text-base leading-relaxed text-[#766571] sm:text-lg">A little care, morning and night. Discover simple steps that work with your skin, not against it.</p>
              <div className="mt-9 flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="#ritual-finder" className={styles.button}>Find my ritual <ArrowUpRight size={18} /></Link>
                <Link href="#daily-ritual" className={styles.secondary}>Explore the steps <ArrowDown size={16} /></Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#e5d9de] pt-5 text-xs text-[#766571]">
                <span className="flex items-center gap-2"><Check size={14} className="text-primary-950" />Simple by design</span>
                <span className="flex items-center gap-2"><Check size={14} className="text-primary-950" />Made for your everyday</span>
              </div>
            </RitualReveal>
            <RitualReveal delay={0.12} className="relative pb-6 pl-4 sm:pl-8">
              <div className="relative aspect-[4/4.5] overflow-hidden rounded-t-[8rem] rounded-b-[2rem] bg-[#e9ddd7] sm:rounded-t-[11rem]">
                <Image src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=85" alt="Skincare essentials arranged for a quiet moment of daily care" fill preload sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#30232d]/60 via-transparent to-transparent" />
                <p className="absolute bottom-8 left-7 right-7 font-accent text-3xl italic text-white sm:text-4xl">A moment for your skin.<br />A moment for you.</p>
                <span className="absolute right-5 top-6 rounded-full border border-white/50 bg-white/85 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#30232d]">The everyday edit</span>
              </div>
              <div className={`${styles.floatingNote} absolute bottom-0 left-0 flex items-center gap-4 rounded-2xl border border-[#e5d9de] bg-[#fffcf8] px-5 py-4 shadow-lg shadow-[#30232d]/5`}>
                <span className="font-accent text-4xl italic text-primary-950">01 /</span>
                <div><p className="text-xs font-semibold">Start with the essentials.</p><p className="mt-1 text-xs text-[#766571]">Build at your own pace.</p></div>
              </div>
            </RitualReveal>
          </div>
        </section>

        <nav aria-label="On this page" className="border-y border-[#e5d9de] bg-[#f2eae6]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:grid-cols-4 sm:px-8 lg:px-10">
            {[["01", "The daily steps", "daily-ritual"], ["02", "Find your ritual", "ritual-finder"], ["03", "Ingredient notes", "ingredients"], ["04", "A little guidance", "ritual-faq"]].map(([number, label, id]) => (
              <a key={id} href={`#${id}`} className="flex min-h-16 items-center gap-3 px-2 py-4 text-xs font-medium transition-colors hover:bg-white/60 hover:text-primary-950 sm:text-sm"><span className="font-accent text-lg italic text-primary-950">{number}</span>{label}</a>
            ))}
          </div>
        </nav>

        <section id="daily-ritual" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24" aria-labelledby="daily-heading">
          <RitualReveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className={styles.eyebrow}>The daily rhythm</p><h2 id="daily-heading" className={styles.heading}>Good days start<br />with <span className="font-accent font-normal italic text-primary-950">a little care.</span></h2></div>
            <p className="max-w-sm text-sm leading-relaxed text-[#766571]">No complicated rules. Just a few purposeful steps, from your first splash of water to your last moment of the day.</p>
          </RitualReveal>
          <RitualRoutine />
        </section>

        <section id="ritual-finder" className="border-y border-[#e5d9de] bg-[#efe4e5] px-5 py-16 sm:px-8 lg:px-10 lg:py-24" aria-label="Find your ritual">
          <RitualFinder />
        </section>

        <section id="ingredients" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24" aria-labelledby="ingredients-heading">
          <RitualReveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className={styles.eyebrow}>Know what goes on your skin</p><h2 id="ingredients-heading" className={styles.heading}>Good ingredients.<br /><span className="font-accent font-normal italic text-primary-950">Clear purpose.</span></h2></div>
            <Link href="/journal" className="inline-flex items-center gap-2 self-start border-b border-[#30232d] pb-2 text-sm font-semibold md:self-auto">Explore the journal <ArrowUpRight size={17} /></Link>
          </RitualReveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {ingredients.map((ingredient, index) => (
              <RitualReveal key={ingredient.name} delay={index * 0.08} className="group rounded-[1.75rem] border border-[#e5d9de] bg-[#fffcf8] p-7 transition-colors hover:bg-white sm:p-8">
                <div className="flex items-center justify-between"><span className="font-accent text-4xl italic text-[#b69aa8]">{ingredient.number}</span><span className="rounded-full bg-[#f3e9ed] px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-primary-950">{ingredient.tag}</span></div>
                <h3 className="mt-10 font-display text-2xl font-semibold tracking-tight">{ingredient.name}</h3>
                <p className="mt-2 font-accent text-xl italic text-primary-950">{ingredient.note}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#766571]">{ingredient.description}</p>
              </RitualReveal>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[#766571]">An introduction to common skincare ingredients, not a claim about every product. Always check the individual formula and directions.</p>
        </section>

        <section id="ritual-faq" className="mx-auto grid max-w-7xl gap-10 border-t border-[#e5d9de] px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-24" aria-labelledby="faq-heading">
          <RitualReveal><p className={styles.eyebrow}>Keep it simple</p><h2 id="faq-heading" className={styles.heading}>A little<br /><span className="font-accent font-normal italic text-primary-950">guidance.</span></h2><p className="mt-5 max-w-xs text-sm leading-relaxed text-[#766571]">Your skin is individual. These are starting points, not a prescription.</p></RitualReveal>
          <div>{faqs.map((faq) => <details key={faq.question} className={`${styles.faq} border-b border-[#e5d9de] py-5`}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-1 font-display text-lg font-medium">{faq.question}<Plus size={18} className="shrink-0 text-primary-950" /></summary><p className="max-w-xl pt-4 text-sm leading-relaxed text-[#766571]">{faq.answer}</p></details>)}</div>
        </section>

        <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 py-24 [clip-path:polygon(0_0,100%_12%,100%_100%,0_100%)]">
          <RitualReveal className="mx-auto max-w-2xl px-6 text-center lg:px-10">
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
          </RitualReveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
