import { useState } from "react";

export type NewsletterSubscribeStatus = "idle" | "loading" | "success" | "error";

/** Shared client for every newsletter signup form; posts to /api/newsletter/subscribe. */
export function useNewsletterSubscribe() {
  const [status, setStatus] = useState<NewsletterSubscribeStatus>("idle");

  async function subscribe(email: string) {
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Subscription failed");
      setStatus("success");
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  }

  return { status, subscribe };
}
