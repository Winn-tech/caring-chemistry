import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { JOURNAL_CATEGORIES } from "../journal-data";

interface JournalCategoriesProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export function JournalCategories({ category, onCategoryChange }: JournalCategoriesProps) {
  return (
    <nav aria-label="Journal categories" className="border-y border-primary-200 bg-[#f8f6f2]">
      <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-6 py-5 lg:px-10">
        {JOURNAL_CATEGORIES.map((item) => (
          <button key={item} type="button" onClick={() => onCategoryChange(item)} className={`relative shrink-0 pb-1 text-sm font-semibold transition-colors ${category === item ? "text-accent-700" : "text-primary-600 hover:text-primary-950"}`}>
            {item}
            {category === item && <motion.span layoutId="active-journal-category" className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-accent-500" transition={{ type: "spring", stiffness: 420, damping: 30 }} />}
          </button>
        ))}
        <ArrowRight size={16} className="ml-auto shrink-0 text-primary-400" aria-hidden="true" />
      </div>
    </nav>
  );
}
