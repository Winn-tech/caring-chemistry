"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { NewsletterCampaignStatus, Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { sendNewsletterBatches } from "@/lib/newsletter";

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
  // Claim the draft atomically so a double click or a second admin cannot send it twice.
  const claimed = await prisma.newsletterCampaign.updateMany({ where: { id, status: NewsletterCampaignStatus.DRAFT }, data: { status: NewsletterCampaignStatus.SENDING } });
  if (claimed.count !== 1) return { error: "Only draft campaigns can be sent." };
  const campaign = await prisma.newsletterCampaign.findUniqueOrThrow({ where: { id } });
  const subscribers = await prisma.newsletterSubscriber.findMany({ where: { isActive: true }, select: { email: true } });
  let sent = 0;
  try {
    await sendNewsletterBatches({ emails: subscribers.map((subscriber) => subscriber.email), subject: campaign.subject, content: campaign.content, onBatchSent: (count) => { sent = count; } });
    await prisma.newsletterCampaign.update({ where: { id }, data: { status: NewsletterCampaignStatus.SENT, recipientCount: sent, sentAt: new Date() } });
    await auditServer(user.id, "NEWSLETTER_CAMPAIGN_SENT", "NewsletterCampaign", id, { recipientCount: sent });
  } catch (error) {
    await prisma.newsletterCampaign.update({ where: { id }, data: { status: NewsletterCampaignStatus.FAILED, recipientCount: sent } });
    await auditServer(user.id, "NEWSLETTER_CAMPAIGN_FAILED", "NewsletterCampaign", id, { recipientCount: sent });
    return { error: error instanceof Error ? error.message : "The campaign could not be sent." };
  }
  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter");
}

export async function unsubscribeSubscriber(formData: FormData) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN]);
  const id = formData.get("id");
  if (typeof id !== "string") return;
  await prisma.newsletterSubscriber.update({ where: { id }, data: { isActive: false } });
  await auditServer(user.id, "NEWSLETTER_SUBSCRIBER_UNSUBSCRIBED", "NewsletterSubscriber", id);
  revalidatePath("/admin/newsletter");
}
