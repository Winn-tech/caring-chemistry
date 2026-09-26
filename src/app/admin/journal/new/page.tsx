import Link from "next/link";
import { Role } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { AdminShell } from "../../components/admin-shell";
import { PostEditor } from "../components/post-editor";

export default async function NewJournalPostPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]);
  return <AdminShell user={user}><Link className="text-sm font-medium text-primary-600 hover:text-primary-950" href="/admin/journal">← Back to journal</Link><h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">Create article</h1><p className="mt-2 text-sm text-primary-600">Draft privately or publish when the article is ready.</p><PostEditor /></AdminShell>;
}
