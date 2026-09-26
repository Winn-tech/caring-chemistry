import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { AboutHero } from "../components/about/about-hero";
import { OurStory } from "../components/about/our-story";
import { OurPhilosophy } from "../components/about/our-philosophy";
import { WhatMakesUsDifferent } from "../components/about/what-makes-us-different";
import { IngredientPhilosophy } from "../components/about/ingredient-philosophy";
import { OurCommitment } from "../components/about/our-commitment";
import { AboutCta } from "../components/about/about-cta";

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutHero />
      <OurStory />
      <OurPhilosophy />
      <WhatMakesUsDifferent />
      <IngredientPhilosophy />
      <OurCommitment />
      <AboutCta/>
      <Footer />
    </main>
  );
}