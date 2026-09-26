"use client";

import { useNewsletterSubscribe } from "../../hooks/use-newsletter-subscribe";

export function NewsletterCta() {
  const { status, subscribe } = useNewsletterSubscribe();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await subscribe(String(new FormData(e.currentTarget).get("email") ?? ""));
  }

  return (
    <section className="border-t border-[#e7dfe5] py-12 text-center">
      <h2 className="font-accent text-xl text-[#2e2032]">Stay in the know</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-[#5b4d5f]">
        Get beauty tips, product launches, and exclusive offers.
      </p>

      {status === "success" ? (
        <p className="mt-5 text-sm font-medium text-[#2e2032]">
          You&apos;re subscribed — thank you.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-5 flex max-w-sm items-center gap-2"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="Email address"
            className="w-full rounded-md border border-[#d8c7ce] px-3.5 py-2.5 text-sm text-[#2e2032] placeholder:text-[#a58d9b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c88041]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 rounded-md bg-[#2e2032] px-4 py-2.5 text-sm font-medium text-[#f8f4f1] transition-colors hover:bg-[#221826] disabled:opacity-60"
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="mt-3 text-xs text-[#a3413a]" role="alert">
          We couldn&apos;t complete that. Please try again.
        </p>
      )}
    </section>
  );
}
