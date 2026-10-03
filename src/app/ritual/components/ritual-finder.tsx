"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, X } from "lucide-react";
import type { ProductCardData } from "@/lib/shop/types";

type SkinConcern =
  | "dryness"
  | "breakouts"
  | "dark-spots"
  | "texture"
  | "dullness"
  | "sensitivity"
  | "oiliness"
  | "aging";

type SkinType = "dry" | "oily" | "combination" | "normal" | "sensitive";
type RitualComplexity = "simple" | "balanced" | "complete";

interface Recommendation {
  title: string;
  description: string;
  focus: string[];
  products: ProductCardData[];
}

const concernOptions: { value: SkinConcern; label: string }[] = [
  { value: "dryness", label: "Dryness" },
  { value: "breakouts", label: "Acne & breakouts" },
  { value: "dark-spots", label: "Dark spots" },
  { value: "texture", label: "Uneven texture" },
  { value: "dullness", label: "Dullness" },
  { value: "sensitivity", label: "Sensitivity" },
  { value: "oiliness", label: "Oiliness" },
  { value: "aging", label: "Aging" },
];

const skinTypeOptions: { value: SkinType; label: string }[] = [
  { value: "dry", label: "Dry" },
  { value: "oily", label: "Oily" },
  { value: "combination", label: "Combination" },
  { value: "normal", label: "Normal" },
  { value: "sensitive", label: "Sensitive" },
];

const complexityOptions: { value: RitualComplexity; label: string }[] = [
  { value: "simple", label: "Simple" },
  { value: "balanced", label: "Balanced" },
  { value: "complete", label: "Complete" },
];

const questionOrder = [
  {
    key: "concern" as const,
    title: "What is your primary skin concern?",
    options: concernOptions,
  },
  {
    key: "skinType" as const,
    title: "How would you describe your skin?",
    options: skinTypeOptions,
  },
  {
    key: "complexity" as const,
    title: "How complicated do you want your ritual to be?",
    options: complexityOptions,
  },
];

function getRecommendation(
  concern: SkinConcern,
  skinType: SkinType,
  complexity: RitualComplexity,
  products: ProductCardData[],
): Recommendation {
  const hydrators = products.filter((product) =>
    /hydrat|cream|moistur|serum|butter|repair/i.test(product.name),
  );
  const brightening = products.filter((product) =>
    /serum|bright|vitamin|radiance|glow|repair/i.test(product.name),
  );
  const clarifying = products.filter((product) =>
    /cleanser|serum|repair|clar|balance|treat/i.test(product.name),
  );
  const barrier = products.filter((product) =>
    /cream|repair|barrier|moistur|butter|serum/i.test(product.name),
  );

  const map: Record<string, Recommendation> = {
    dryness: {
      title: "Hydrate + Restore",
      description:
        "A soft, replenishing ritual designed to comfort dehydrated skin and support a resilient barrier.",
      focus: ["Cleanse gently", "Deep hydration", "Barrier support"],
      products: [...hydrators, ...barrier].slice(0, 4),
    },
    breakouts: {
      title: "Clear + Balance",
      description:
        "A focused ritual to help maintain a clean, balanced complexion without over-stripping the skin.",
      focus: ["Fresh start", "Targeted care", "Oil balance"],
      products: [...clarifying, ...hydrators].slice(0, 4),
    },
    "dark-spots": {
      title: "Brighten + Even",
      description:
        "A luminous ritual built around supportive ingredients for a more even-looking complexion.",
      focus: ["Radiance", "Even tone", "Daily protection"],
      products: [...brightening, ...hydrators].slice(0, 4),
    },
    texture: {
      title: "Smooth + Renew",
      description:
        "A refining ritual for smoother-feeling skin with a lightweight, targeted texture-support approach.",
      focus: ["Polish", "Supportive treatment", "Comfort"],
      products: [...brightening, ...hydrators].slice(0, 4),
    },
    dullness: {
      title: "Glow + Restore",
      description:
        "A brightening, comfort-led ritual that helps skin look fresher, smoother and more alive.",
      focus: ["Glow", "Hydration", "Daily ritual"],
      products: [...brightening, ...hydrators].slice(0, 4),
    },
    sensitivity: {
      title: "Calm + Protect",
      description:
        "A gentle ritual focused on comfort, nourishment and a stronger skin barrier.",
      focus: ["Barrier care", "Comfort", "Minimal steps"],
      products: [...barrier, ...hydrators].slice(0, 4),
    },
    oiliness: {
      title: "Balance + Refine",
      description:
        "A streamlined ritual to help regulate excess oil while keeping skin comfortable and hydrated.",
      focus: ["Fresh cleanse", "Lightweight hydration", "Balance"],
      products: [...clarifying, ...hydrators].slice(0, 4),
    },
    aging: {
      title: "Firm + Nourish",
      description:
        "A thoughtful ritual designed to support skin texture, hydration and a smoother-looking finish.",
      focus: ["Supportive care", "Smooth texture", "Day-to-day ritual"],
      products: [...brightening, ...barrier].slice(0, 4),
    },
  };

  const base = map[concern] ?? map.dryness;

  if (skinType === "oily" || skinType === "combination") {
    return {
      ...base,
      focus: [base.focus[0], "Lightweight hydration", "Balanced finish"],
      products: base.products.length > 0 ? base.products : products.slice(0, 4),
    };
  }

  if (skinType === "dry" || skinType === "sensitive") {
    return {
      ...base,
      focus: ["Gentle cleanse", ...base.focus.slice(0, 2)],
      products: base.products.length > 0 ? base.products : products.slice(0, 4),
    };
  }

  if (complexity === "simple") {
    return {
      ...base,
      focus: ["3-step ritual", ...base.focus.slice(0, 2)],
      products: base.products.slice(0, 3),
    };
  }

  if (complexity === "complete") {
    return {
      ...base,
      focus: ["Full routine", ...base.focus],
      products: base.products.length > 0 ? base.products : products.slice(0, 4),
    };
  }

  return base;
}

interface RitualFinderProps {
  products: ProductCardData[];
}

export function RitualFinder({ products }: RitualFinderProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ concern?: SkinConcern; skinType?: SkinType; complexity?: RitualComplexity }>({});
  const [result, setResult] = useState<Recommendation | null>(null);

  const currentQuestion = questionOrder[currentStep];
  const progress = ((currentStep + 1) / questionOrder.length) * 100;

  const updateAnswer = (value: string) => {
    const key = currentQuestion.key;
    const next = {
      ...answers,
      [key]: value,
    };
    setAnswers(next);

    if (currentStep < questionOrder.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }

    if (next.concern && next.skinType && next.complexity) {
      setResult(getRecommendation(next.concern, next.skinType, next.complexity, products));
    }
  };

  const reset = () => {
    setOpen(false);
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pb-5 pt-6 lg:px-10">
        <div className="rounded-[2rem] border border-primary-100 bg-[#f7f1ef] px-6 py-8 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="font-accent text-xl italic text-accent-700">Not sure where to start?</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-primary-950">Find your ritual.</h2>
              <p className="mt-3 text-sm leading-relaxed text-primary-600">
                Tell us what your skin is asking for and we’ll guide you to a simple starting point.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
            >
              Find My Ritual
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#271a26]/55 px-4 py-6 backdrop-blur-[2px]"
            onClick={reset}
          >
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="mx-auto flex h-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-[#fffaf8] shadow-[0_30px_80px_rgba(30,18,26,0.22)]"
            >
              <div className="flex items-center justify-between border-b border-primary-100 px-5 py-4 sm:px-7">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-700">
                    Ritual Finder
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-primary-950">Build your ritual</h3>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-primary-700 transition-colors hover:bg-primary-100 hover:text-primary-950"
                  aria-label="Close finder"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-5 pt-5 sm:px-7">
                <div className="h-2 overflow-hidden rounded-full bg-[#f0e6e0]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-700 to-accent-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
                  {currentStep + 1} / {questionOrder.length}
                </p>
              </div>

              {!result ? (
                <div className="flex flex-1 flex-col px-5 pb-6 pt-6 sm:px-7">
                  <h4 className="font-display text-2xl font-semibold text-primary-950">{currentQuestion.title}</h4>

                  <div className="mt-6 grid gap-3">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateAnswer(option.value)}
                        className="flex items-center justify-between rounded-2xl border border-primary-200 bg-white px-4 py-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50"
                      >
                        <span className="text-sm font-medium text-primary-800">{option.label}</span>
                        <ArrowRight size={16} className="text-accent-700" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col gap-6 px-5 py-6 sm:px-7">
                  <div className="rounded-3xl bg-primary-950 p-6 text-white">
                    <div className="flex items-center gap-2 text-accent-300">
                      <Sparkles size={18} />
                      <span className="text-xs font-semibold uppercase tracking-[0.2em]">Your Ritual</span>
                    </div>
                    <h4 className="mt-4 font-display text-3xl font-semibold">{result.title}</h4>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-200">{result.description}</p>
                  </div>

                  <div className="space-y-3">
                    {result.focus.map((step) => (
                      <div key={step} className="flex items-center gap-3 rounded-2xl border border-primary-200 bg-white px-4 py-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                          <Check size={14} />
                        </span>
                        <span className="text-sm text-primary-700">{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-primary-200 bg-[#f9f4f2] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Suggested products</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.products.length > 0 ? (
                        result.products.map((product) => (
                          <span key={product.id} className="rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs font-medium text-primary-700">
                            {product.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-primary-600">A few essential products from our shop collection.</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-primary-200 bg-white px-5 py-3 text-sm font-semibold text-primary-800 transition-colors hover:border-primary-300 hover:bg-primary-50"
                    >
                      Try again
                    </button>
                    <a
                      href="/shop"
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-primary-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
                    >
                      Shop My Ritual
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
