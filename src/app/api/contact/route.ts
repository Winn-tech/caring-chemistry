import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api";
import { contactMessageSchema } from "@/lib/contact";
import { notifyContactInbox } from "@/lib/contact-notify";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/security";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: "Please check your message and try again." }, { status: 400 });
    }

    // Hidden "website" field: people never see it, spam bots fill it in. Pretend it worked.
    if (typeof body === "object" && body !== null && "website" in body && typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const result = contactMessageSchema.safeParse(body);
    if (!result.success) {
      const issue = result.error.issues[0];
      return NextResponse.json({ success: false, message: issue?.message ?? "Please check your message and try again.", field: issue?.path[0] }, { status: 422 });
    }

    await rateLimit(`contact:${clientIp(request)}`, 5, 60 * 60 * 1000);
    await prisma.contactMessage.create({ data: { ...result.data, phone: result.data.phone ?? null } });
    await notifyContactInbox(result.data);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return NextResponse.json({ success: false, message: "You've sent several messages already. Please wait a while before sending another." }, { status: 429 });
    }
    console.error("Contact message failed", error);
    return NextResponse.json({ success: false, message: "We couldn't send your message. Please try again in a moment." }, { status: 500 });
  }
}
