import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";

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
