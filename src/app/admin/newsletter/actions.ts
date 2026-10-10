"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { NewsletterCampaignStatus, Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { deliverQueuedCampaign, newsletterAllowance, newsletterSendsInBackground, requeueCampaign, stuckCampaignCutoff, triggerBackgroundSend } from "@/lib/newsletter-campaign";

export type NewsletterActionState = { error?: string };
const campaignSchema = z.object({ subject: z.string().trim().min(3).max(180), content: z.string().trim().min(10).max(100_000) });

export async function createCampaign(_: NewsletterActionState, formData: FormData): Promise<NewsletterActionState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN]);
  const result = campaignSchema.safeParse({ subject: formData.get("subject"), content: formData.get("content") });
  if (!result.success) return { error: result.error.issues[0]?.message ?? "Please review the campaign." };
  const campaign = await prisma.newsletterCampaign.create({ data: { ...result.data, createdById: user.id } });
  await auditServer(user.id, "NEWSLETTER_CAMPAIGN_CREATED", "NewsletterCampaign", campaign.id);
  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter");
}

export async function sendCampaign(_: NewsletterActionState, formData: FormData): Promise<NewsletterActionState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN]);
  const id = formData.get("id");
  if (typeof id !== "string" || !z.string().cuid().safeParse(id).success) return { error: "Invalid campaign." };
  // Queue the draft atomically so a double click or a second admin cannot send it twice.
  const queued = await prisma.newsletterCampaign.updateMany({ where: { id, status: NewsletterCampaignStatus.DRAFT }, data: { status: NewsletterCampaignStatus.QUEUED } });
  if (queued.count !== 1) return { error: "Only draft campaigns can be sent." };
  await auditServer(user.id, "NEWSLETTER_CAMPAIGN_QUEUED", "NewsletterCampaign", id);

  const result = await runQueuedCampaign(id, user.id);
  if (result.notStarted) {
    // Nothing was sent, so the campaign can simply go back to being a draft.
    await prisma.newsletterCampaign.updateMany({ where: { id, status: NewsletterCampaignStatus.QUEUED }, data: { status: NewsletterCampaignStatus.DRAFT } });
    return { error: "The send could not be started. The campaign is still a draft; please try again." };
  }
  if (result.error) return { error: result.error };
  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter");
}

/**
 * "Continue sending now" for a PAUSED campaign, or "Retry" for a FAILED one. Sends to the
 * subscribers who haven't received it yet, within today's allowance; nobody gets it twice.
 */
export async function continueCampaign(_: NewsletterActionState, formData: FormData): Promise<NewsletterActionState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN]);
  const id = formData.get("id");
  if (typeof id !== "string" || !z.string().cuid().safeParse(id).success) return { error: "Invalid campaign." };

  const allowance = await newsletterAllowance();
  if (allowance.remaining === 0) {
    const when = allowance.nextFreeAt ? ` More can be sent from ${allowance.nextFreeAt.toLocaleString("en-NG", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" })}.` : "";
    return { error: `Today's sending allowance (${allowance.limit} emails per 24 hours) is used up.${when} The campaign will continue automatically.` };
  }
  if (!(await requeueCampaign(id))) return { error: "This campaign is already sending or finished. Refresh the page." };
  await auditServer(user.id, "NEWSLETTER_CAMPAIGN_CONTINUED", "NewsletterCampaign", id);

  const result = await runQueuedCampaign(id, user.id);
  if (result.notStarted) {
    // Nothing was sent; leave it paused so it can be continued later (manually or by the scheduler).
    await prisma.newsletterCampaign.updateMany({ where: { id, status: NewsletterCampaignStatus.QUEUED }, data: { status: NewsletterCampaignStatus.PAUSED } });
    return { error: "The send could not be started. The campaign stays paused; please try again." };
  }
  if (result.error) return { error: result.error };
  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter");
}

/**
 * Runs a QUEUED campaign: on Netlify (NEWSLETTER_SEND_MODE=background) it starts the background
 * function and returns at once; otherwise (local development, Vercel) it sends within this
 * request (see maxDuration on the page). Running out of allowance is not an error: the campaign
 * simply pauses and the page shows it.
 */
async function runQueuedCampaign(campaignId: string, actorId: string): Promise<{ notStarted?: true; error?: string }> {
  if (newsletterSendsInBackground()) return (await triggerBackgroundSend(campaignId, actorId)) ? {} : { notStarted: true };
  const result = await deliverQueuedCampaign(campaignId, actorId);
  return result.outcome === "failed" || result.outcome === "skipped" ? { error: result.error } : {};
}

/**
 * A send that was cut off (server restart, timeout, crashed job) would stay QUEUED or SENDING
 * forever. Once it is past stuckCampaignCutoff() it is no longer running:
 * - QUEUED that never started: back to DRAFT if nobody has it yet, otherwise PAUSED;
 * - SENDING that stopped partway: FAILED (it can then be retried without re-sending to anyone).
 */
export async function releaseStuckCampaign(formData: FormData) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN]);
  const id = formData.get("id");
  if (typeof id !== "string" || !z.string().cuid().safeParse(id).success) return;
  const staleBefore = stuckCampaignCutoff();
  const toDraft = await prisma.newsletterCampaign.updateMany({ where: { id, status: NewsletterCampaignStatus.QUEUED, updatedAt: { lt: staleBefore }, recipientCount: 0 }, data: { status: NewsletterCampaignStatus.DRAFT } });
  const toPaused = await prisma.newsletterCampaign.updateMany({ where: { id, status: NewsletterCampaignStatus.QUEUED, updatedAt: { lt: staleBefore }, recipientCount: { gt: 0 } }, data: { status: NewsletterCampaignStatus.PAUSED } });
  const failed = await prisma.newsletterCampaign.updateMany({ where: { id, status: NewsletterCampaignStatus.SENDING, updatedAt: { lt: staleBefore } }, data: { status: NewsletterCampaignStatus.FAILED } });
  if (toDraft.count === 1) await auditServer(user.id, "NEWSLETTER_CAMPAIGN_RETURNED_TO_DRAFT", "NewsletterCampaign", id);
  if (toPaused.count === 1) await auditServer(user.id, "NEWSLETTER_CAMPAIGN_PAUSED", "NewsletterCampaign", id, { reason: "send never started" });
  if (failed.count === 1) await auditServer(user.id, "NEWSLETTER_CAMPAIGN_MARKED_FAILED", "NewsletterCampaign", id);
  revalidatePath("/admin/newsletter");
}

export async function unsubscribeSubscriber(formData: FormData) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN]);
  const id = formData.get("id");
  if (typeof id !== "string") return;
  await prisma.newsletterSubscriber.update({ where: { id }, data: { isActive: false } });
  await auditServer(user.id, "NEWSLETTER_SUBSCRIBER_UNSUBSCRIBED", "NewsletterSubscriber", id);
  revalidatePath("/admin/newsletter");
}
