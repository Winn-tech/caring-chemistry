"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PostStatus, Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { z } from "zod";

export type PostFormState = { error?: string };
const optionalText = (max: number) => z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().max(max).optional());
const postSchema = z.object({
  title: z.string().trim().min(2).max(180),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: optionalText(500),
  category: z.enum(BLOG_CATEGORIES),
  content: z.string().trim().min(20).max(100_000),
  coverUrl: z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().url().max(2_000).optional()),
  status: z.enum([PostStatus.DRAFT, PostStatus.PUBLISHED]),
});
function parse(formData: FormData) { return postSchema.safeParse({ title: formData.get("title"), slug: formData.get("slug"), excerpt: formData.get("excerpt"), category: formData.get("category"), content: formData.get("content"), coverUrl: formData.get("coverUrl"), status: formData.get("status") }); }
function errorMessage(result: ReturnType<typeof parse>) { return result.success ? undefined : result.error.issues[0]?.message ?? "Please review the article."; }

export async function createPost(_: PostFormState, formData: FormData): Promise<PostFormState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]);
  const result = parse(formData); const error = errorMessage(result);
  if (error || !result.success) return { error };
  try {
    const post = await prisma.blogPost.create({ data: { ...result.data, authorId: user.id, publishedAt: result.data.status === PostStatus.PUBLISHED ? new Date() : undefined } });
    await auditServer(user.id, "BLOG_POST_CREATED", "BlogPost", post.id, { status: post.status });
  } catch (cause) { if (isUnique(cause)) return { error: "An article with this slug already exists." }; throw cause; }
  revalidatePath("/admin/journal"); revalidatePath("/journal", "layout"); redirect("/admin/journal");
}

export async function updatePost(_: PostFormState, formData: FormData): Promise<PostFormState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]);
  const id = formData.get("id");
  if (typeof id !== "string" || !z.string().cuid().safeParse(id).success) return { error: "Invalid article." };
  const result = parse(formData); const error = errorMessage(result);
  if (error || !result.success) return { error };
  const current = await prisma.blogPost.findUnique({ where: { id }, select: { id: true, authorId: true, publishedAt: true } });
  if (!current || (user.role === Role.SOCIAL_TEAM && current.authorId !== user.id)) return { error: "You do not have access to this article." };
  try {
    await prisma.blogPost.update({ where: { id }, data: { ...result.data, coverUrl: result.data.coverUrl ?? null, publishedAt: result.data.status === PostStatus.PUBLISHED ? current.publishedAt ?? new Date() : null } });
    await auditServer(user.id, "BLOG_POST_UPDATED", "BlogPost", id, { status: result.data.status });
  } catch (cause) { if (isUnique(cause)) return { error: "An article with this slug already exists." }; throw cause; }
  revalidatePath("/admin/journal"); revalidatePath(`/admin/journal/${id}`); revalidatePath("/journal", "layout"); redirect("/admin/journal");
}

function isUnique(error: unknown) { return typeof error === "object" && error !== null && "code" in error && error.code === "P2002"; }
