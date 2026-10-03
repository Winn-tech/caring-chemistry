"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { NewsletterCampaignStatus, Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { deliverQueuedCampaign, NEWSLETTER_BACKGROUND_PATH, newsletterJobAuthHeader, newsletterSendsInBackground, stuckCampaignCutoff } from "@/lib/newsletter-campaign";

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

  if (newsletterSendsInBackground()) {
    // Netlify: hand off to the background function (up to 15 minutes) and return at once.
    const started = await startBackgroundSend(id, user.id);
    if (!started) {
      // Nothing was sent, so the campaign can simply go back to being a draft.
      await prisma.newsletterCampaign.updateMany({ where: { id, status: NewsletterCampaignStatus.QUEUED }, data: { status: NewsletterCampaignStatus.DRAFT } });
      return { error: "The send could not be started. The campaign is still a draft; please try again." };
    }
  } else {
    // Local development / Vercel: send within this request (see maxDuration on the page).
    const result = await deliverQueuedCampaign(id, user.id);
    if (result.error) return { error: result.error };
  }
  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter");
}

async function startBackgroundSend(campaignId: string, actorId: string) {
  try {
    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error("APP_URL is required to start the newsletter background send.");
    const response = await fetch(new URL(NEWSLETTER_BACKGROUND_PATH, appUrl), {
      method: "POST",
      headers: { Authorization: newsletterJobAuthHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, actorId }),
      cache: "no-store",
    });
    // Netlify answers 202 Accepted as soon as a background function has been queued.
    if (response.status !== 202) throw new Error(`Background function answered ${response.status}.`);
    return true;
  } catch (error) {
    console.error("Could not start the newsletter background send", error);
    return false;
  }
}

/**
 * A send that was cut off (server restart, timeout, crashed job) would stay QUEUED or SENDING
 * forever. Once it is past stuckCampaignCutoff() it is no longer running: a QUEUED one never
 * started and goes back to draft; a SENDING one stopped partway and is marked failed.
 */
export async function releaseStuckCampaign(formData: FormData) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN]);
  const id = formData.get("id");
  if (typeof id !== "string" || !z.string().cuid().safeParse(id).success) return;
  const staleBefore = stuckCampaignCutoff();
  const requeued = await prisma.newsletterCampaign.updateMany({ where: { id, status: NewsletterCampaignStatus.QUEUED, updatedAt: { lt: staleBefore } }, data: { status: NewsletterCampaignStatus.DRAFT } });
  const failed = await prisma.newsletterCampaign.updateMany({ where: { id, status: NewsletterCampaignStatus.SENDING, updatedAt: { lt: staleBefore } }, data: { status: NewsletterCampaignStatus.FAILED } });
  if (requeued.count === 1) await auditServer(user.id, "NEWSLETTER_CAMPAIGN_RETURNED_TO_DRAFT", "NewsletterCampaign", id);
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
