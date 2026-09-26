import { createHash, createHmac } from "node:crypto";

export function createUnsubscribeToken(email: string) {
  const token = unsubscribeTokenForEmail(email);
  return { token, tokenHash: hashUnsubscribeToken(token) };
}

export function unsubscribeTokenForEmail(email: string) {
  const secret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) throw new Error("Newsletter unsubscribe links require NEWSLETTER_UNSUBSCRIBE_SECRET or AUTH_SECRET.");
  return createHmac("sha256", secret).update(normalizeEmail(email)).digest("base64url");
}

export function hashUnsubscribeToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function htmlEscape(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
}

function config() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const appUrl = process.env.APP_URL;
  if (!apiKey || !from || !appUrl) throw new Error("Newsletter email requires RESEND_API_KEY, RESEND_FROM_EMAIL, and APP_URL.");
  try { return { apiKey, from, appUrl: new URL(appUrl).origin }; } catch { throw new Error("APP_URL must be an absolute URL."); }
}

/** Resend's batch endpoint accepts at most 100 emails per request. */
const BATCH_SIZE = 100;
/** Stays under Resend's default limit of 2 requests per second. */
const BATCH_INTERVAL_MS = 600;
const MAX_RATE_LIMIT_RETRIES = 3;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function renderNewsletterHtml(content: string, unsubscribeUrl: string) {
  const paragraphs = content.split(/\r?\n+/).filter(Boolean).map((paragraph) => `<p>${htmlEscape(paragraph)}</p>`).join("");
  return `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#35182b;max-width:640px">${paragraphs}<hr style="border:0;border-top:1px solid #eadce4;margin:32px 0"><p style="font-size:12px;color:#765d6d">You are receiving this email because you subscribed to Caring Chemistry. <a href="${unsubscribeUrl}">Unsubscribe</a></p></div>`;
}

async function postBatch(apiKey: string, emails: object[]) {
  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(emails),
      cache: "no-store",
    });
    if (response.ok) return;
    if (response.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
      const retryAfter = Number(response.headers.get("retry-after"));
      await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * (attempt + 1));
      continue;
    }
    throw new Error("The newsletter email could not be sent.");
  }
}

/**
 * Sends one campaign to many recipients in batches of 100, each with its own unsubscribe link.
 * Returns how many emails Resend accepted; on failure the error carries no count, so callers
 * should track progress through `onBatchSent`.
 */
export async function sendNewsletterBatches(input: { emails: string[]; subject: string; content: string; onBatchSent?: (sentSoFar: number) => void }) {
  const settings = config();
  let sent = 0;
  for (let index = 0; index < input.emails.length; index += BATCH_SIZE) {
    if (index > 0) await wait(BATCH_INTERVAL_MS);
    const batch = input.emails.slice(index, index + BATCH_SIZE).map((email) => ({
      from: settings.from,
      to: [email],
      subject: input.subject,
      html: renderNewsletterHtml(input.content, `${settings.appUrl}/newsletter/unsubscribe/${unsubscribeTokenForEmail(email)}`),
    }));
    await postBatch(settings.apiKey, batch);
    sent += batch.length;
    input.onBatchSent?.(sent);
  }
  return sent;
}
