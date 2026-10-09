import { Reveal } from "../reveal";

const INGREDIENTS = [
  { name: "Niacinamide", purpose: "Barrier support", benefit: "Helps strengthen and calm the skin barrier over time." },
  { name: "Hyaluronic Acid", purpose: "Hydration", benefit: "Draws in and holds moisture for lasting hydration." },
  { name: "Ceramides", purpose: "Barrier support", benefit: "Helps restore and maintain the skin's natural barrier." },
  { name: "Peptides", purpose: "Resilience", benefit: "Supports the skin's natural firmness over time." },
];

export function IngredientPhilosophy() {
  return (
    <section id="ingredient-philosophy" className="bg-primary-950 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <span className="font-accent text-lg italic text-accent-400">Formulation Philosophy</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">What&apos;s inside matters.</h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-300 sm:text-base lg:text-[17px]">We select every ingredient for a reason we can explain - never because it&apos;s trending. Here&apos;s a look at a few staples across our formulas.</p>
        </Reveal>

        <div className="mt-12 divide-y divide-primary-800 border-y border-primary-800">
          {INGREDIENTS.map((ingredient, index) => (
            <Reveal key={ingredient.name} delay={index * 80}>
              <div className="group grid grid-cols-1 gap-2 py-6 transition-[padding] duration-300 hover:px-3 sm:grid-cols-[1fr_1fr_2fr] sm:items-center sm:gap-6">
                <p className="font-display text-base font-semibold text-white transition-colors duration-300 group-hover:text-accent-300 lg:text-[17px]">{ingredient.name}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-accent-400 lg:text-[17px]">{ingredient.purpose}</p>
                <p className="text-sm text-primary-300 lg:text-[17px]">{ingredient.benefit}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
