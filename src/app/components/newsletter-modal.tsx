"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNewsletterSubscribe } from "../hooks/use-newsletter-subscribe";

const DISMISSED_KEY = "caring-chemistry-newsletter-dismissed";
const SUBSCRIBED_KEY = "caring-chemistry-newsletter-subscribed";

export function NewsletterModal({ trigger = "homepage" }: { trigger?: "homepage" | "reading" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { status, subscribe } = useNewsletterSubscribe();

  useEffect(() => {
    if (window.localStorage.getItem(DISMISSED_KEY) || window.localStorage.getItem(SUBSCRIBED_KEY)) return;

    let hasTriggered = false;
    const triggerAt = trigger === "reading" ? 0.75 : 0.5;
    const delay = trigger === "reading" ? 10 * 60 * 1000 : undefined;
    function handleScroll() {
      if (hasTriggered) return;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0 || window.scrollY / scrollableHeight < triggerAt) return;
      hasTriggered = true;
      setIsOpen(true);
    }

    const timeout = delay ? window.setTimeout(() => {
      if (hasTriggered) return;
      hasTriggered = true;
      setIsOpen(true);
    }, delay) : undefined;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [trigger]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function closeModal() {
    window.localStorage.setItem(DISMISSED_KEY, "true");
    setIsOpen(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await subscribe(email)) window.localStorage.setItem(SUBSCRIBED_KEY, "true");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/5 p-4 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-modal-title"
        >
          <motion.div
            className="relative grid w-full max-w-3xl overflow-hidden rounded-[2rem] bg-[#fffaf7] shadow-2xl sm:grid-cols-[0.82fr_1.18fr]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="relative hidden min-h-105 overflow-hidden bg-primary-900 sm:block">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-primary-950/35" />
              <div className="relative flex h-full flex-col justify-end p-8 text-white">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-200">The considered edit</span>
                <p className="mt-3 max-w-55 font-display text-3xl font-semibold leading-tight">Good skin care, made quieter.</p>
              </div>
            </div>

            <div className="relative px-7 py-9 sm:px-10 sm:py-12">
              <button type="button" onClick={closeModal} aria-label="Close newsletter signup" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-950">
                <X size={18} />
              </button>
              {status === "success" ? (
                <div className="flex min-h-70 flex-col justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-700"><Check size={22} /></div>
                  <h2 id="newsletter-modal-title" className="mt-6 font-display text-3xl font-semibold text-primary-950">You&apos;re on the list.</h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-600">Expect thoughtful skincare notes, early product news, and the occasional considered offer.</p>
                  <button type="button" onClick={closeModal} className="mt-8 w-fit rounded-full bg-primary-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800">Continue browsing</button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-700">A little something for your inbox</p>
                  <h2 id="newsletter-modal-title" className="mt-4 max-w-sm font-display text-4xl font-semibold leading-[0.98] text-primary-950">Skin care worth staying in for.</h2>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-600">Join our private list for calm, useful guidance and first access to new formulas.</p>
                  <form onSubmit={handleSubmit} className="mt-8 space-y-3">
                    <label htmlFor="newsletter-modal-email" className="sr-only">Email address</label>
                    <input id="newsletter-modal-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" className="input rounded-full border-primary-200 bg-white px-5 py-3.5 text-sm" />
                    <button type="submit" disabled={status === "loading"} className="group flex w-full items-center justify-center gap-2 rounded-full bg-accent-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700 disabled:opacity-60">
                      {status === "loading" ? "Joining..." : "Join the list"}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                    {status === "error" && <p className="text-center text-xs text-red-700" role="alert">We couldn&apos;t complete that. Please try again.</p>}
                  </form>
                  <p className="mt-5 text-center text-[11px] leading-relaxed text-primary-400">No noise. Just considered skincare notes. Unsubscribe anytime.</p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}