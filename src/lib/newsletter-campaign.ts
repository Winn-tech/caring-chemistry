import { createHash, timingSafeEqual } from "node:crypto";
import { NewsletterCampaignStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { sendNewsletterBatches } from "@/lib/newsletter";

// Kept free of Next.js imports: it also runs inside the Netlify background function
// (netlify/functions/send-newsletter-background.mts), which is bundled separately.

/** Path of the Netlify background function; the `-background` suffix is what makes Netlify run it asynchronously. */
export const NEWSLETTER_BACKGROUND_PATH = "/.netlify/functions/send-newsletter-background";

/**
 * "background" hands sending to the Netlify background function (up to 15 minutes, needed on
 * Netlify where normal requests are cut off after seconds). Anything else sends inline in the
 * admin request, which suits `next dev` and Vercel.
 */
export function newsletterSendsInBackground() {
  return process.env.NEWSLETTER_SEND_MODE === "background";
}

/**
 * A queued or sending campaign with no progress for this long has stopped: a live send saves
 * progress after every batch (about once a second).
 */
const STUCK_AFTER_MS = 10 * 60 * 1000;

/** Campaigns last updated before this moment count as stuck. */
export function stuckCampaignCutoff() {
  return new Date(Date.now() - STUCK_AFTER_MS);
}

/** Shared secret the admin action presents to the background function, whose URL is public. */
function jobSecret() {
  const secret = process.env.NEWSLETTER_JOB_SECRET;
  if (!secret || secret.length < 32) throw new Error("NEWSLETTER_JOB_SECRET must be set to a 32+ character secret.");
  return secret;
}

export function newsletterJobAuthHeader() {
  return `Bearer ${jobSecret()}`;
}

/** Constant-time check of the Authorization header sent to the background function. */
export function isAuthorizedNewsletterJob(authorization: string | null) {
  if (!authorization) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(authorization), digest(newsletterJobAuthHeader()));
}

async function audit(actorId: string, action: string, campaignId: string, metadata?: object) {
  await prisma.auditLog.create({ data: { actorId, action, entity: "NewsletterCampaign", entityId: campaignId, metadata } });
}

/**
 * Sends a QUEUED campaign to every active subscriber.
 *
 * The QUEUED -> SENDING step is an atomic claim: only one run can win it, so a retried or
 * duplicated job (Netlify retries background functions that crash) finds nothing to send and
 * cannot email subscribers twice. Progress is saved after each batch of 100, so the admin page
 * can show it. Ends with the campaign SENT or FAILED; returns an error message on failure.
 */
export async function deliverQueuedCampaign(campaignId: string, actorId: string): Promise<{ error?: string }> {
  const claimed = await prisma.newsletterCampaign.updateMany({
    where: { id: campaignId, status: NewsletterCampaignStatus.QUEUED },
    data: { status: NewsletterCampaignStatus.SENDING, recipientCount: 0 },
  });
  if (claimed.count !== 1) return { error: "This campaign is not waiting to be sent." };
  const campaign = await prisma.newsletterCampaign.findUniqueOrThrow({ where: { id: campaignId } });

  const subscribers = await prisma.newsletterSubscriber.findMany({ where: { isActive: true }, select: { email: true } });
  let sent = 0;
  try {
    await sendNewsletterBatches({
      emails: subscribers.map((subscriber) => subscriber.email),
      subject: campaign.subject,
      content: campaign.content,
      onBatchSent: async (count) => {
        sent = count;
        await prisma.newsletterCampaign.update({ where: { id: campaignId }, data: { recipientCount: sent } });
      },
    });
    await prisma.newsletterCampaign.update({ where: { id: campaignId }, data: { status: NewsletterCampaignStatus.SENT, recipientCount: sent, sentAt: new Date() } });
    await audit(actorId, "NEWSLETTER_CAMPAIGN_SENT", campaignId, { recipientCount: sent });
    return {};
  } catch (error) {
    console.error("Newsletter campaign failed", campaignId, error);
    await prisma.newsletterCampaign.update({ where: { id: campaignId }, data: { status: NewsletterCampaignStatus.FAILED, recipientCount: sent } });
    await audit(actorId, "NEWSLETTER_CAMPAIGN_FAILED", campaignId, { recipientCount: sent });
    return { error: error instanceof Error ? error.message : "The campaign could not be sent." };
  }
}
