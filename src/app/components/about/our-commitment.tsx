import { Leaf, Package, Recycle } from "lucide-react";
import { Reveal } from "../reveal";

const COMMITMENTS = [
  { icon: Package, title: "Responsible Packaging", description: "We continuously look for ways to reduce unnecessary packaging across every product line." },
  { icon: Leaf, title: "Ethical Sourcing", description: "We work to understand where our ingredients come from, and who they come from." },
  { icon: Recycle, title: "Less Waste", description: "We design with longevity and responsible consumption in mind, not single-use excess." },
];

export function OurCommitment() {
  return (
    <section id="our-commitment" className="bg-[#F7F3EF] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <span className="font-accent text-lg italic text-accent-600">Our Commitment</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">Better beauty, responsibly.</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {COMMITMENTS.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 100}>
              <Icon size={24} className="text-accent-600 transition-transform duration-500 hover:-translate-y-1 hover:rotate-6" />
              <h3 className="mt-4 font-display text-base font-semibold text-primary-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-500">{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}