import Link from "next/link";
import { notFound } from "next/navigation";
import { confirmUnsubscribe } from "./actions";

export const dynamic = "force-dynamic";

const COPY = {
  confirm: {
    title: "Unsubscribe from our newsletter?",
    body: "You will stop receiving Caring Chemistry newsletters. You can join again at any time.",
  },
  done: {
    title: "You are unsubscribed",
    body: "You will no longer receive Caring Chemistry newsletters.",
  },
  invalid: {
    title: "That link has expired",
    body: "We could not find an active subscription for this link.",
  },
};

// Opening the link only asks for confirmation. Email security scanners open links automatically,
// so unsubscribing on page load would remove people who never asked to leave.
export default async function UnsubscribePage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ status?: string }> }) {
  const { token } = await params;
  const { status } = await searchParams;
  if (!token || token.length < 20) notFound();
  const state = status === "done" ? "done" : status === "invalid" ? "invalid" : "confirm";
  const copy = COPY[state];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-6 py-16">
      <section className="w-full max-w-lg rounded-2xl border border-primary-100 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="font-display text-2xl font-semibold text-primary-950">Caring Chemistry</p>
        <h1 className="mt-8 font-display text-3xl font-semibold text-primary-950">{copy.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-primary-600">{copy.body}</p>
        {state === "confirm" ? (
          <form action={confirmUnsubscribe} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <input type="hidden" name="token" value={token} />
            <button type="submit" className="inline-flex rounded-lg bg-primary-950 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-800">
              Yes, unsubscribe me
            </button>
            <Link className="inline-flex rounded-lg border border-primary-200 px-5 py-3 text-sm font-semibold text-primary-900 hover:border-primary-400" href="/">
              Keep me subscribed
            </Link>
          </form>
        ) : (
          <Link className="mt-8 inline-flex rounded-lg bg-primary-950 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-800" href="/">
            Return to Caring Chemistry
          </Link>
        )}
      </section>
    </main>
  );
}
