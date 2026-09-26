import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { Role } from "@/generated/prisma/client";

const INVITATION_TTL_MS = 1000 * 60 * 60 * 48;

export const STAFF_ROLES = [Role.SALES_TEAM, Role.SOCIAL_TEAM] as const;

export function createInvitationToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashInvitationToken(token), expiresAt: new Date(Date.now() + INVITATION_TTL_MS) };
}

export function hashInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function htmlEscape(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
}

function invitationConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const appUrl = process.env.APP_URL;
  if (!apiKey || !from || !appUrl) throw new Error("Staff invitations require RESEND_API_KEY, RESEND_FROM_EMAIL, and APP_URL.");
  try { return { apiKey, from, appUrl: new URL(appUrl).origin }; } catch { throw new Error("APP_URL must be an absolute URL."); }
}

export async function sendStaffInvitation(input: { email: string; name: string; token: string }) {
  const config = invitationConfig();
  const link = `${config.appUrl}/staff/invite/${input.token}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: config.from,
      to: [input.email],
      subject: "You’re invited to Caring Chemistry Admin",
      html: `<p>Hello ${htmlEscape(input.name)},</p><p>You have been invited to the Caring Chemistry admin workspace. Set your password to activate your account.</p><p><a href="${link}">Set up your account</a></p><p>This link expires in 48 hours and can be used once.</p>`,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("The invitation email could not be sent. Check your Resend configuration and resend the invitation.");
}

export async function createPendingPasswordHash() {
  return bcrypt.hash(randomBytes(32).toString("hex"), 12);
}
