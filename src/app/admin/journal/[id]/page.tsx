import Link from "next/link";
import { notFound } from "next/navigation";
import { Role } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../../components/admin-shell";
import { PostEditor } from "../components/post-editor";

export const dynamic = "force-dynamic";
export default async function EditJournalPostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]);
  const { id } = await params;
  const post = await prisma.blogPost.findFirst({ where: { id, ...(user.role === Role.SOCIAL_TEAM ? { authorId: user.id } : {}) }, select: { id: true, title: true, slug: true, excerpt: true, category: true, content: true, coverUrl: true, status: true } });
  if (!post) notFound();
  return <AdminShell user={user}><Link className="text-sm font-medium text-primary-600 hover:text-primary-950" href="/admin/journal">← Back to journal</Link><h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">Edit article</h1><p className="mt-2 text-sm text-primary-600">Changes are validated and written to the audit log.</p><PostEditor post={post} /></AdminShell>;
}
