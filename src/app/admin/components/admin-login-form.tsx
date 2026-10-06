"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        // Cookie-only: the session token stays in the httpOnly cookie, out of reach of page scripts.
        headers: { "Content-Type": "application/json", "X-Session-Mode": "cookie" },
        credentials: "same-origin",
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error ?? "Unable to sign in.");
      // The session cookie is now set; the dashboard's server check reads it on navigation.
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
      setPending(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={submit}>
      <div>
        <label className="text-sm font-medium text-primary-800" htmlFor="email">Email address</label>
        <input className="mt-2 w-full rounded-lg border border-primary-200 px-3.5 py-3 text-sm outline-none transition focus:border-accent-600 focus:ring-2 focus:ring-accent-100" id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <label className="text-sm font-medium text-primary-800" htmlFor="password">Password</label>
        <div className="relative mt-2">
          <input className="w-full rounded-lg border border-primary-200 py-3 pl-3.5 pr-11 text-sm outline-none transition focus:border-accent-600 focus:ring-2 focus:ring-accent-100" id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            aria-controls="password"
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-primary-500 outline-none transition-colors hover:text-primary-900 focus-visible:ring-2 focus-visible:ring-accent-100"
          >
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">{error}</p>}
      <button className="w-full rounded-lg bg-primary-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Signing in…" : "Sign in securely"}
      </button>
    </form>
  );
}
