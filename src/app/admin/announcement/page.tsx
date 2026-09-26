import { Role } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";
import { AnnouncementEditor } from "./components/announcement-editor";

export const dynamic = "force-dynamic";
export default async function AnnouncementPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]);
  const announcement = await prisma.announcementBar.findFirst({ orderBy: { updatedAt: "desc" }, select: { id: true, isActive: true, content: true, speed: true, background: true, textColor: true, direction: true, link: true } });
  return <AdminShell user={user}><header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Marketing</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Announcement bar</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary-600">Manage the single message displayed above the storefront navigation. Activating this configuration automatically replaces any previously active announcement.</p></header><AnnouncementEditor announcement={announcement ?? undefined} /></AdminShell>;
}
