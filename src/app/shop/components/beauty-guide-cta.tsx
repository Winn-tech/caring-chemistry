import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BeautyGuideCta() {
  return (
    <section className="my-14 rounded-xl bg-[#2e2032] px-6 py-10 sm:px-10">
      <div className="max-w-md">
        <h2 className="font-accent text-2xl text-[#f8f4f1]">Not sure what you need?</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#f8f4f1]/70">
          Tell us about your skin and we&apos;ll help you find the right products — in under two minutes.
        </p>
        <Link
          href="/ritual#ritual-finder"
          className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-[#f8f4f1] px-5 py-2.5 text-sm font-medium text-[#2e2032] transition-colors hover:bg-[#efe6e0]"
        >
          Find my routine
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
