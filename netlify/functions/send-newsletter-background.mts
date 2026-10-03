import { z } from "zod";
import { deliverQueuedCampaign, isAuthorizedNewsletterJob } from "@/lib/newsletter-campaign";

// Netlify background function: the "-background" filename suffix makes Netlify reply 202 to the
// caller at once and keep this running for up to 15 minutes, long enough for large campaigns.
// Started by the admin "Send" action when NEWSLETTER_SEND_MODE=background.

const jobSchema = z.object({ campaignId: z.string().cuid(), actorId: z.string().cuid() });

export default async function sendNewsletterBackground(request: Request) {
  // The function URL is public, so only the admin action (which holds the secret) may start a send.
  if (request.method !== "POST" || !isAuthorizedNewsletterJob(request.headers.get("authorization"))) {
    console.warn("Rejected unauthorised newsletter job request");
    return;
  }

  const job = jobSchema.safeParse(await request.json().catch(() => null));
  if (!job.success) {
    console.warn("Rejected malformed newsletter job request");
    return;
  }

  // deliverQueuedCampaign atomically moves QUEUED -> SENDING before sending, so a retried,
  // duplicated or replayed request finds nothing to claim and cannot send a campaign twice.
  const result = await deliverQueuedCampaign(job.data.campaignId, job.data.actorId);
  if (result.error) console.error("Newsletter background send ended with an error:", result.error);
}
