import type { ContactMessageInput } from "@/lib/contact";
import { htmlEscape } from "@/lib/newsletter";

/**
 * Emails the team about a new message, when CONTACT_INBOX_EMAIL is set. Replying to that email
 * replies to the visitor. The message is already saved by then, so a failure here is only logged.
 */
export async function notifyContactInbox(input: ContactMessageInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_INBOX_EMAIL?.split(",").map((address) => address.trim()).filter(Boolean) ?? [];
  if (!apiKey || !from || to.length === 0) return;

  const appUrl = process.env.APP_URL?.replace(/\/$/, "");
  const inboxLink = appUrl ? `<p><a href="${htmlEscape(`${appUrl}/admin/messages`)}">Open the admin inbox</a></p>` : "";
  const rows = [
    ["Name", input.name],
    ["Email", input.email],
    ["Phone", input.phone ?? "Not given"],
    ["Topic", input.topic],
  ]
    .map(([label, value]) => `<tr><td style="padding:4px 16px 4px 0;color:#765d6d">${label}</td><td style="padding:4px 0">${htmlEscape(value)}</td></tr>`)
    .join("");
  const message = htmlEscape(input.message).replace(/\r?\n/g, "<br>");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: input.email,
        subject: `New message: ${input.topic} from ${input.name}`.slice(0, 200),
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#35182b;max-width:640px"><p>A new message arrived through the contact form.</p><table style="font-size:14px;border-collapse:collapse">${rows}</table><p style="margin-top:20px;padding:16px;background:#f7f3ef;border-radius:8px">${message}</p><p style="font-size:13px;color:#765d6d">Reply to this email to answer ${htmlEscape(input.name)} directly.</p>${inboxLink}</div>`,
      }),
      cache: "no-store",
    });
    if (!response.ok) console.error("Contact notification email failed", response.status, await response.text().catch(() => ""));
  } catch (error) {
    console.error("Contact notification email failed", error);
  }
}
