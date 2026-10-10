import { continueNextPausedCampaign, newsletterSendsInBackground } from "@/lib/newsletter-campaign";

// Netlify scheduled function: runs every hour on the published site. When the daily newsletter
// allowance has room again, it continues the oldest paused campaign by starting the background
// send function, so campaigns larger than the allowance finish over several days on their own.
// Scheduled functions have a short time limit, so this only starts the send; it never sends itself.

export default async function newsletterScheduler() {
  if (!newsletterSendsInBackground()) {
    console.log("Newsletter scheduler: NEWSLETTER_SEND_MODE is not 'background'; nothing to do.");
    return;
  }
  try {
    console.log(`Newsletter scheduler: ${await continueNextPausedCampaign()}`);
  } catch (error) {
    console.error("Newsletter scheduler failed", error);
  }
}

export const config = { schedule: "@hourly" };
