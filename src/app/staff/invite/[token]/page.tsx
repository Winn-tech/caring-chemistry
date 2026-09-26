import { prisma } from "@/lib/prisma";
import { hashInvitationToken } from "@/lib/staff-invitations";
import { InvitationForm } from "./invitation-form";

export const dynamic = "force-dynamic";

export default async function StaffInvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const account = await prisma.user.findFirst({ where: { invitationTokenHash: hashInvitationToken(token), invitationExpiresAt: { gt: new Date() }, invitationAcceptedAt: null }, select: { name: true, email: true } });

  return <main className="flex min-h-screen items-center justify-center bg-[#f7f3ef] px-6 py-12 text-primary-950"><section className="w-full max-w-md rounded-xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Caring Chemistry</p>{account ? <><h1 className="mt-3 font-display text-3xl font-semibold">Set up your account</h1><p className="mt-3 text-sm leading-relaxed text-primary-600">Welcome, {account.name}. Choose a password to activate your {account.email} admin account.</p><InvitationForm token={token} /></> : <><h1 className="mt-3 font-display text-3xl font-semibold">Invitation unavailable</h1><p className="mt-3 text-sm leading-relaxed text-primary-600">This invitation is invalid, expired, or has already been used. Ask a General Admin to send a new invitation.</p></>}</section></main>;
}
