import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/security";
import { createUnsubscribeToken, normalizeEmail } from "@/lib/newsletter";

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(320) });

export async function POST(request: Request) {
  try {
    await rateLimit(`newsletter-subscribe:${clientIp(request)}`, 5, 60 * 60 * 1000);
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) return NextResponse.json({ success: false, message: "Enter a valid email address." }, { status: 422 });
    const email = normalizeEmail(result.data.email);
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) await prisma.newsletterSubscriber.update({ where: { id: existing.id }, data: { isActive: true, confirmedAt: new Date() } });
      return NextResponse.json({ success: true, message: "You're subscribed!" });
    }
    const { tokenHash } = createUnsubscribeToken(email);
    await prisma.newsletterSubscriber.create({ data: { email, confirmedAt: new Date(), unsubscribeTokenHash: tokenHash } });
    return NextResponse.json({ success: true, message: "You're subscribed!" }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return NextResponse.json({ success: false, message: "We could not complete your subscription. Please try again." }, { status: 500 });
  }
}
