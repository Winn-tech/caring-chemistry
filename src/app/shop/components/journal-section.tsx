import Link from "next/link";
import { PostStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

const FALLBACK_ARTICLES = [
  { title: "How to Layer Your Skincare", slug: "how-to-layer-skincare" },
  { title: "Choosing the Right Serum", slug: "choosing-the-right-serum" },
  { title: "Understanding SPF", slug: "understanding-spf" },
];

export async function JournalSection() {
  const posts = await prisma.blogPost.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: { title: true, slug: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const articles = posts.length > 0 ? posts : FALLBACK_ARTICLES;

  return (
    <section className="border-t border-[#e7dfe5] py-12">
      <h2 className="font-accent text-xl text-[#2e2032]">Learn more about your skin</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {articles.map((article) => (
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
