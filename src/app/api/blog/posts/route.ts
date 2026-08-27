import { PostStatus } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: { id: true, title: true, slug: true, excerpt: true, coverUrl: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return NextResponse.json({ data: posts });
}