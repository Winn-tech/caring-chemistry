import { PostStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { JournalArticle } from "./journal-data";

const DEFAULT_COVER = "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=85";

const postSelect = { slug: true, title: true, excerpt: true, category: true, concern: true, content: true, coverUrl: true, publishedAt: true } as const;
type PublishedPost = { slug: string; title: string; excerpt: string | null; category: string; concern: string | null; content: string; coverUrl: string | null; publishedAt: Date | null };

/** Shapes a published admin post like the built-in journal articles, so both render the same way. */
function toJournalArticle(post: PublishedPost): JournalArticle {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: post.category,
    concern: post.concern ?? undefined,
    readTime: `${Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))} min read`,
    date: (post.publishedAt ?? new Date()).toLocaleDateString("en-NG", { dateStyle: "long" }),
    publishedAt: (post.publishedAt ?? new Date()).toISOString(),
    image: post.coverUrl ?? DEFAULT_COVER,
    body: post.content.split(/\n+/).filter(Boolean),
  };
}

export async function getPublishedJournalArticles(): Promise<JournalArticle[]> {
  const posts = await prisma.blogPost.findMany({ where: { status: PostStatus.PUBLISHED }, orderBy: { publishedAt: "desc" }, select: postSelect });
  return posts.map(toJournalArticle);
}

export async function getPublishedJournalArticle(slug: string): Promise<JournalArticle | null> {
  const post = await prisma.blogPost.findFirst({ where: { slug, status: PostStatus.PUBLISHED }, select: postSelect });
  return post ? toJournalArticle(post) : null;
}
