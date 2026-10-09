import Image from "next/image";
import productGroup from "../../../../public/images/product-group.jpeg";
import { Reveal } from "../reveal";

export function OurStory() {
  return (
    <section id="our-story" className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
        <Reveal>
          <div className="about-image-panel w-full overflow-hidden rounded-2xl">
            <Image
              src={productGroup}
              alt="Caring Chemistry skincare and fragrance product collection"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <span className="font-accent text-lg italic text-accent-600">Our Story</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Where it all began.
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-primary-600 sm:text-[18px]">
            <p>
                Founded in 2004, Caring Chemistry is a technological avanced and innovative company that has gained a reputation for luxury elegance and superior quality.
            </p>
            <p>
              Our promise: To produce cosmetics that upholds the finest standards of excellence. Through comprehensive research and strigent product evaluation, we are pleased to offer
              skincare and fragrance products that are both gentle and highly effective.
            </p>
            <p>
               Every product we&apos;ve released since has followed the same rule - if we can&apos;t explain why an ingredient is in there, it doesn&apos;t go in the bottle.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
