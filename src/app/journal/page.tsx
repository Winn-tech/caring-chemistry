import { Suspense } from "react";
import { PostStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { AnnouncementBar } from "../components/announcement-bar";
import { Navbar } from "../components/navbar";
import { JournalPageContent } from "./journal-page-content";

export default async function JournalPage() {
  const posts = await prisma.blogPost.findMany({ where: { status: PostStatus.PUBLISHED }, orderBy: { publishedAt: "desc" }, select: { slug: true, title: true, excerpt: true, category: true, content: true, coverUrl: true, publishedAt: true } });
  const adminArticles = posts.map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt ?? "", category: post.category, readTime: `${Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))} min read`, date: (post.publishedAt ?? new Date()).toLocaleDateString("en-NG", { dateStyle: "long" }), image: post.coverUrl ?? "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=85", body: post.content.split(/\n+/).filter(Boolean) }));
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Suspense fallback={null}>
        <JournalPageContent adminArticles={adminArticles} />
      </Suspense>
    </main>
  );
}
