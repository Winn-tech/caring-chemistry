import { PostStatus, Role } from "@/generated/prisma/client";
import { z } from "zod";
import { ApiError, errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";
const schema = z.object({ title: z.string().min(2).max(180).optional(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(), excerpt: z.string().max(500).nullable().optional(), content: z.string().min(20).max(100000).optional(), coverUrl: z.string().url().nullable().optional(), status: z.nativeEnum(PostStatus).optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]); const { id } = await params; const input = schema.parse(await request.json()); const existing = await prisma.blogPost.findUnique({ where: { id }, select: { authorId: true, publishedAt: true } }); if (!existing || (user.role === Role.SOCIAL_TEAM && existing.authorId !== user.id)) throw new ApiError(403, "You do not have permission to edit this article."); const post = await prisma.blogPost.update({ where: { id }, data: { ...input, ...(input.status === PostStatus.PUBLISHED ? { publishedAt: existing.publishedAt ?? new Date() } : {}) } }); await audit(user.id, "BLOG_POST_UPDATED", "BlogPost", id, request); return ok(post); } catch (error) { return errorResponse(error); } }
