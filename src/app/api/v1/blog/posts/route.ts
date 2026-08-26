import { PostStatus, Role } from "@/generated/prisma/client";
import { z } from "zod";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";

const schema = z.object({
  title: z.string().min(2).max(180),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(20).max(100000),
  coverUrl: z.string().url().optional(),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
});

export async function GET(request: Request) {
  try {
    await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM, Role.SOCIAL_TEAM]);

    return ok(
      await prisma.blogPost.findMany({
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
        orderBy: { updatedAt: "desc" },
      })
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]);
    const input = schema.parse(await request.json());

    const post = await prisma.blogPost.create({
      data: {
        ...input,
        publishedAt: input.status === PostStatus.PUBLISHED ? new Date() : undefined,
        authorId: user.id,
      },
    });

    await audit(user.id, "BLOG_POST_CREATED", "BlogPost", post.id, request);

    return ok(post, 201);
  } catch (error) {
    return errorResponse(error);
  }
}