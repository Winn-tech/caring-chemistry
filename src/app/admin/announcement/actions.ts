"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { AnnouncementDirection, Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { announcementLinkSchema } from "@/lib/announcement";
import { z } from "zod";

export type AnnouncementFormState = { error?: string; success?: string };
const schema = z.object({ content: z.string().trim().min(1).max(500), isActive: z.boolean(), speed: z.coerce.number().int().min(10).max(1_000), background: z.string().regex(/^#[0-9a-fA-F]{6}$/), textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/), direction: z.enum(["left", "right"]), link: announcementLinkSchema });

export async function saveAnnouncement(_: AnnouncementFormState, formData: FormData): Promise<AnnouncementFormState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]);
  const id = formData.get("id");
  if (id !== null && (typeof id !== "string" || !z.string().min(1).max(128).safeParse(id).success)) return { error: "Invalid announcement." };
  const parsed = schema.safeParse({ content: formData.get("content"), isActive: formData.get("isActive") === "on", speed: formData.get("speed"), background: formData.get("background"), textColor: formData.get("textColor"), direction: formData.get("direction"), link: formData.get("link") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please review the announcement." };
  const data = { ...parsed.data, direction: parsed.data.direction === "right" ? AnnouncementDirection.RIGHT : AnnouncementDirection.LEFT };

  const saved = await prisma.$transaction(async (tx) => {
    if (data.isActive) await tx.announcementBar.updateMany({ where: { isActive: true, ...(id ? { id: { not: id } } : {}) }, data: { isActive: false } });
    return id ? tx.announcementBar.update({ where: { id }, data }) : tx.announcementBar.create({ data: { id: randomUUID(), ...data } });
  });
  await auditServer(user.id, id ? "ANNOUNCEMENT_BAR_UPDATED" : "ANNOUNCEMENT_BAR_CREATED", "AnnouncementBar", saved.id, { isActive: saved.isActive });
  revalidatePath("/", "layout");
  revalidatePath("/admin/announcement");
  return { success: saved.isActive ? "Announcement saved and is now live." : "Announcement saved as inactive." };
}
