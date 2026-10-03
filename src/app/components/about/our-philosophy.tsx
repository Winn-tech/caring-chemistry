import { Reveal } from "../reveal";

const PRINCIPLES = [
  { number: "01", title: "Quality", description: "Through continuous Research and Developmentand by keeping tabs on global developments, We are able to source for the finest ingredients from accross the globe to deliver advanced and effective formulation." },
  { number: "02", title: "Simplicity", description: "Effective routines without unnecessary complexity - skincare that fits into a real life." },
  { number: "03", title: "Transparency", description: "All o f our products are created based on long standing experience in offering superior formulations that deliver superb results. You deserve to know exactly what goes onto your skin, and why it's there." },
  { number: "04", title: "Confidence", description: "Or promise has always been an unconditional guarantee of quality. Skincare should help you feel comfortable in your own skin - that's the actual goal." },
];

export function OurPhilosophy() {
  return (
    <section id="our-philosophy" className="bg-[#F7F3EF] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <span className="font-accent text-lg italic text-accent-600">Our Philosophy</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">Beauty, with intention.</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.number} delay={index * 100} className="flex gap-5">
              <span className="font-display text-3xl font-bold text-primary-200">{principle.number}</span>
              <div>
                <h3 className="font-display text-lg font-semibold text-primary-950">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-500">{principle.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}