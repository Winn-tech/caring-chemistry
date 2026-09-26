import Link from "next/link";
import { notFound } from "next/navigation";
import { hashUnsubscribeToken } from "@/lib/newsletter";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UnsubscribePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!token || token.length < 20) notFound();
  const result = await prisma.newsletterSubscriber.updateMany({ where: { unsubscribeTokenHash: hashUnsubscribeToken(token) }, data: { isActive: false } });
  const unsubscribed = result.count > 0;
  return <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-6 py-16"><section className="w-full max-w-lg rounded-2xl border border-primary-100 bg-white p-8 text-center shadow-sm sm:p-12"><p className="font-display text-2xl font-semibold text-primary-950">Caring Chemistry</p><h1 className="mt-8 font-display text-3xl font-semibold text-primary-950">{unsubscribed ? "You are unsubscribed" : "That link has expired"}</h1><p className="mt-4 text-sm leading-relaxed text-primary-600">{unsubscribed ? "You will no longer receive Caring Chemistry newsletters." : "We could not find an active subscription for this link."}</p><Link className="mt-8 inline-flex rounded-lg bg-primary-950 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-800" href="/">Return to Caring Chemistry</Link></section></main>;
}
