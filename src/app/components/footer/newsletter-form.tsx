// app/components/footer/newsletter-form.tsx
"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useNewsletterSubscribe } from "../../hooks/use-newsletter-subscribe";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const { status, subscribe } = useNewsletterSubscribe();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (await subscribe(email)) setEmail("");
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-full border border-accent-300/30 bg-white/5 px-5 py-3.5 text-sm text-white/85" role="status">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-300 text-[#2e2032]">
          <Check size={15} />
        </span>
        You&apos;re on the list — welcome in.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2 rounded-[1.75rem] border border-white/15 bg-white/5 p-1.5 transition-colors focus-within:border-accent-300/60 focus-within:bg-white/10 sm:flex-row sm:items-center sm:rounded-full">
        <input
          id="footer-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-accent-300 px-6 py-3 text-sm font-semibold text-[#2e2032] transition-colors hover:bg-accent-200 disabled:opacity-60"
        >
          {status === "loading" ? "Joining..." : "Join the list"}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      {status === "error" && (
        <p className="mt-3 px-4 text-xs text-accent-200" role="alert">
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}