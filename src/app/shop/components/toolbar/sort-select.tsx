"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/shop/constants";
import { buildShopHref } from "@/lib/shop/query";
import type { SortKey } from "@/lib/shop/types";

interface SortSelectProps {
  value: SortKey;
}

export function SortSelect({ value }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const labelId = useId();

  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  function select(next: SortKey) {
    setOpen(false);
    router.push(buildShopHref(searchParams, { sort: next === "featured" ? null : next }));
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-[#d8c7ce] bg-white px-3.5 py-2 text-sm text-[#2e2032] transition-colors hover:border-[#c9b5c1]"
      >
        <span id={labelId} className="text-[#5b4d5f]">
          Sort:
        </span>
        {current.label}
        <ChevronDown
          className={`h-4 w-4 text-[#5b4d5f] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              aria-hidden="true"
              tabIndex={-1}
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setOpen(false)}
            />
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md border border-[#eedfe4] bg-white p-1 shadow-lg shadow-[#2e2032]/5"
            >
              {SORT_OPTIONS.map((option) => (
                <li key={option.value} role="option" aria-selected={option.value === value}>
                  <button
                    type="button"
                    onClick={() => select(option.value)}
                    className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-[#2e2032] transition-colors hover:bg-[#f5efee]"
                  >
                    {option.label}
                    {option.value === value && <Check className="h-4 w-4 text-[#c88041]" />}
                  </button>
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
