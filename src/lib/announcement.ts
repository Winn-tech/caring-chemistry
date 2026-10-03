import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

/**
 * An announcement link is either a path on this site or a secure https:// URL. Plain `.url()`
 * would also accept data: and javascript: addresses, so every write path uses this instead.
 * Empty values become null (no link).
 */
export const announcementLinkSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() ? value.trim() : null),
  z
    .string()
    .max(2_000)
    .nullable()
    .refine(
      (value) => value === null || (value.startsWith("/") && !value.startsWith("//")) || /^https:\/\//i.test(value),
      "Use a site path starting with / or a secure https:// URL."
    )
);

export type PublicAnnouncement = {
  content: string;
  background: string;
  textColor: string;
  speed: number;
  direction: "left" | "right";
  link: string | null;
};

export async function getActiveAnnouncement(): Promise<PublicAnnouncement | null> {
  noStore();
  const announcement = await prisma.announcementBar.findFirst({
    where: { isActive: true },
    select: { content: true, background: true, textColor: true, speed: true, direction: true, link: true },
    orderBy: { updatedAt: "desc" },
  });
  if (!announcement) return null;
  return { ...announcement, direction: announcement.direction === "RIGHT" ? "right" : "left" };
}
