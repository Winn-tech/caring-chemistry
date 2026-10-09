import Link from "next/link";
import { PostStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function JournalSection() {
  const posts = await prisma.blogPost.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: { title: true, slug: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  if (posts.length === 0) return null;

  return (
    <section className="border-t border-[#e7dfe5] py-12">
      <h2 className="font-accent text-xl text-[#2e2032]">Learn more about your skin</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {posts.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/journal/${article.slug}`}
              className="group block rounded-lg border border-[#e7dfe5] p-5 transition-colors hover:border-[#d3b3c0]"
            >
              <span className="text-sm font-medium text-[#2e2032] group-hover:text-[#4d3d50]">
                {article.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
