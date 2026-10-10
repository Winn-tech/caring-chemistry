import { createHash, timingSafeEqual } from "node:crypto";
import { NewsletterCampaignStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { NEWSLETTER_BATCH_INTERVAL_MS, NEWSLETTER_BATCH_SIZE, NewsletterQuotaError, sendNewsletterBatch } from "@/lib/newsletter";

// Kept free of Next.js imports: it also runs inside the Netlify functions
// (netlify/functions/send-newsletter-background.mts and newsletter-scheduler.mts), bundled separately.

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

// ---------------------------------------------------------------------------------------------
// Daily allowance
// ---------------------------------------------------------------------------------------------

/**
 * Default number of newsletter emails per 24 hours. Resend's free plan allows about 100 a day,
 * shared with staff invitation emails, so 90 leaves room for those. Set NEWSLETTER_DAILY_LIMIT
 * higher after upgrading the email plan.
 */
const DEFAULT_DAILY_LIMIT = 90;
const ALLOWANCE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function newsletterDailyLimit() {
  const configured = Number(process.env.NEWSLETTER_DAILY_LIMIT);
  return Number.isInteger(configured) && configured > 0 ? configured : DEFAULT_DAILY_LIMIT;
}

export type NewsletterAllowance = { limit: number; used: number; remaining: number; nextFreeAt: Date | null };

/**
 * Newsletter emails sent in the last 24 hours against the daily limit. A rolling window stays
 * within the provider's limit whether it resets at midnight or on a rolling basis.
 * `nextFreeAt` is when the oldest counted email leaves the window (only set when none remain).
 */
export async function newsletterAllowance(now = new Date()): Promise<NewsletterAllowance> {
  const since = new Date(now.getTime() - ALLOWANCE_WINDOW_MS);
  const limit = newsletterDailyLimit();
  const used = await prisma.newsletterDelivery.count({ where: { sentAt: { gte: since } } });
  const remaining = Math.max(0, limit - used);
  let nextFreeAt: Date | null = null;
  if (remaining === 0) {
    const oldest = await prisma.newsletterDelivery.findFirst({ where: { sentAt: { gte: since } }, orderBy: { sentAt: "asc" }, select: { sentAt: true } });
    nextFreeAt = oldest ? new Date(oldest.sentAt.getTime() + ALLOWANCE_WINDOW_MS) : null;
  }
  return { limit, used, remaining, nextFreeAt };
}

// ---------------------------------------------------------------------------------------------
// Stuck sends
// ---------------------------------------------------------------------------------------------

/**
 * A queued or sending campaign with no progress for this long has stopped: a live send saves
 * progress after every batch (about once a second).
 */
const STUCK_AFTER_MS = 10 * 60 * 1000;

/** Campaigns last updated before this moment count as stuck. */
export function stuckCampaignCutoff() {
  return new Date(Date.now() - STUCK_AFTER_MS);
}

// ---------------------------------------------------------------------------------------------
// Background job authentication and triggering
// ---------------------------------------------------------------------------------------------

/** Shared secret presented to the background function, whose URL is public. */
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

/**
 * Starts the Netlify background function for a QUEUED campaign. Returns false if it could not be
 * started; the caller then moves the campaign back to where it was, since nothing was sent.
 */
export async function triggerBackgroundSend(campaignId: string, actorId: string | null) {
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

// ---------------------------------------------------------------------------------------------
// Sending
// ---------------------------------------------------------------------------------------------

async function audit(actorId: string | null, action: string, campaignId: string, metadata?: object) {
  // actorId is null when the hourly scheduler continues a campaign on its own.
  await prisma.auditLog.create({ data: { actorId, action, entity: "NewsletterCampaign", entityId: campaignId, metadata } });
}

/** Active subscribers this campaign has not been sent to yet, oldest subscriptions first. */
async function pendingRecipients(campaignId: string) {
  const [subscribers, delivered] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" }, select: { email: true } }),
    prisma.newsletterDelivery.findMany({ where: { campaignId }, select: { email: true } }),
  ]);
  const done = new Set(delivered.map((delivery) => delivery.email));
  return subscribers.map((subscriber) => subscriber.email).filter((email) => !done.has(email));
}

/** How many active subscribers still need this campaign (for progress on the admin page). */
export async function pendingRecipientCount(campaignId: string) {
  return (await pendingRecipients(campaignId)).length;
}

async function syncedRecipientCount(campaignId: string) {
  return prisma.newsletterDelivery.count({ where: { campaignId } });
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type DeliveryOutcome = { outcome: "sent" | "paused" | "failed" | "skipped"; error?: string };

/**
 * Sends a QUEUED campaign to every active subscriber who has not received it yet, within the
 * daily allowance.
 *
 * - The QUEUED -> SENDING step is an atomic claim: only one run can win it, so a retried or
 *   duplicated job (Netlify retries background functions that crash) finds nothing to claim.
 * - Each batch's recipients are recorded once the provider accepts it, and pending recipients
 *   are re-read before every batch, so a continued campaign never emails anyone twice and
 *   people who unsubscribe midway are skipped.
 * - When the allowance (or the provider's quota) runs out, the campaign is PAUSED; it continues
 *   later from where it stopped. It ends SENT when everyone has it, or FAILED on another error.
 */
export async function deliverQueuedCampaign(campaignId: string, actorId: string | null): Promise<DeliveryOutcome> {
  const claimed = await prisma.newsletterCampaign.updateMany({
    where: { id: campaignId, status: NewsletterCampaignStatus.QUEUED },
    data: { status: NewsletterCampaignStatus.SENDING },
  });
  if (claimed.count !== 1) return { outcome: "skipped", error: "This campaign is not waiting to be sent." };
  const campaign = await prisma.newsletterCampaign.findUniqueOrThrow({ where: { id: campaignId } });

  const pause = async (reason: string) => {
    const recipientCount = await syncedRecipientCount(campaignId);
    await prisma.newsletterCampaign.update({ where: { id: campaignId }, data: { status: NewsletterCampaignStatus.PAUSED, recipientCount } });
    await audit(actorId, "NEWSLETTER_CAMPAIGN_PAUSED", campaignId, { recipientCount, reason });
    return { outcome: "paused" as const };
  };

  try {
    let sentThisRun = 0;
    for (;;) {
      const pending = await pendingRecipients(campaignId);
      if (pending.length === 0) break;

      const allowance = await newsletterAllowance();
      if (allowance.remaining === 0) return await pause("daily allowance used");

      if (sentThisRun > 0) await wait(NEWSLETTER_BATCH_INTERVAL_MS);
      const batch = pending.slice(0, Math.min(NEWSLETTER_BATCH_SIZE, allowance.remaining));
      await sendNewsletterBatch({ emails: batch, subject: campaign.subject, content: campaign.content });
      await prisma.newsletterDelivery.createMany({ data: batch.map((email) => ({ campaignId, email })), skipDuplicates: true });
      sentThisRun += batch.length;
      // Saving progress also refreshes updatedAt, which is how a stopped send is recognised.
      await prisma.newsletterCampaign.update({ where: { id: campaignId }, data: { recipientCount: await syncedRecipientCount(campaignId) } });
    }

    const recipientCount = await syncedRecipientCount(campaignId);
    await prisma.newsletterCampaign.update({ where: { id: campaignId }, data: { status: NewsletterCampaignStatus.SENT, recipientCount, sentAt: new Date() } });
    await audit(actorId, "NEWSLETTER_CAMPAIGN_SENT", campaignId, { recipientCount });
    return { outcome: "sent" };
  } catch (error) {
    if (error instanceof NewsletterQuotaError) return await pause("email provider quota reached");
    console.error("Newsletter campaign failed", campaignId, error);
    const recipientCount = await syncedRecipientCount(campaignId);
    await prisma.newsletterCampaign.update({ where: { id: campaignId }, data: { status: NewsletterCampaignStatus.FAILED, recipientCount } });
    await audit(actorId, "NEWSLETTER_CAMPAIGN_FAILED", campaignId, { recipientCount });
    return { outcome: "failed", error: error instanceof Error ? error.message : "The campaign could not be sent." };
  }
}

/**
 * Moves a PAUSED or FAILED campaign back to QUEUED so it can continue. Atomic: returns false if
 * the campaign was not in one of those states (e.g. another admin or the scheduler got there first).
 */
export async function requeueCampaign(campaignId: string) {
  const requeued = await prisma.newsletterCampaign.updateMany({
    where: { id: campaignId, status: { in: [NewsletterCampaignStatus.PAUSED, NewsletterCampaignStatus.FAILED] } },
    data: { status: NewsletterCampaignStatus.QUEUED },
  });
  return requeued.count === 1;
}

/**
 * Used by the hourly scheduler: if there is allowance left, continues the oldest paused campaign.
 * One campaign per run, so concurrent sends never compete for the same allowance.
 */
export async function continueNextPausedCampaign(): Promise<string> {
  const allowance = await newsletterAllowance();
  if (allowance.remaining === 0) return "No allowance left in the last 24 hours; nothing to do.";

  const campaign = await prisma.newsletterCampaign.findFirst({ where: { status: NewsletterCampaignStatus.PAUSED }, orderBy: { updatedAt: "asc" }, select: { id: true, subject: true } });
  if (!campaign) return "No paused campaigns.";
  if (!(await requeueCampaign(campaign.id))) return "The paused campaign was already picked up.";

  const started = await triggerBackgroundSend(campaign.id, null);
  if (!started) {
    await prisma.newsletterCampaign.updateMany({ where: { id: campaign.id, status: NewsletterCampaignStatus.QUEUED }, data: { status: NewsletterCampaignStatus.PAUSED } });
    return `Could not start the send for "${campaign.subject}"; it stays paused and will be retried next hour.`;
  }
  return `Continuing "${campaign.subject}" with up to ${allowance.remaining} emails.`;
}
