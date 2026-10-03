import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Navbar } from "@/app/components/navbar";
import { PageHero } from "@/app/components/page-hero";
import { Footer } from "@/app/components/footer";
import { RitualFinder } from "./components/ritual-finder";
import { RitualRoutine } from "./components/ritual-routine";
import { RitualReveal } from "./components/ritual-reveal";
import styles from "./ritual.module.css";
import { getActiveProductCards } from "@/lib/shop/get-products";

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

// The finder recommends from live products, so refresh the page at most every 5 minutes
// instead of freezing the product list at build time.
export const revalidate = 300;

export default async function RitualPage() {
  const products = await getActiveProductCards();

  return (
    <div className={`${styles.page} bg-[#f9f5f2] text-[#30232d]`}>
      <Navbar />
      <main>
        <PageHero
          crumb="Your daily ritual"
          title="Your Daily Ritual"
          description="Less routine, more ritual. A little care, morning and night - simple steps that work with your skin, not against it."
          imageSrc="/images/White_Opal_Banner.png"
          imageAlt="A smiling woman holding a bottle of White Opal lotion"
          textSide="right"
        />

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
          <RitualFinder products={products} />
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
