import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { PageHero } from "../page-hero";

export function AboutHero() {
  return (
    <PageHero
      crumb="About"
      title="About Us"
      description="Beauty, thoughtfully made. We believe skincare should be simple, effective, and made with intention - never a routine you have to think too hard about."
      imageSrc="/images/body-treat.png"
      imageAlt="A woman with glowing skin holding a jar of Body Treat"
      textSide="right"
    >
      <div className="flex justify-center">
        <Link
          href="#our-story"
          className="about-scroll-cue flex items-center gap-2 text-sm font-medium text-primary-500 transition-colors hover:text-accent-600"
        >
          Our Story
          <ArrowDown size={15} />
        </Link>
      </div>
    </PageHero>
  );
}
