"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { PublicAnnouncement } from "@/lib/announcement";

export function AnnouncementBarClient({ announcement }: { announcement: PublicAnnouncement }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const message = <span className="inline-flex items-center gap-8 whitespace-nowrap px-8 text-xs font-semibold uppercase tracking-[0.16em]"><span className="h-1.5 w-1.5 rounded-full bg-accent-300" aria-hidden="true" />{announcement.content}</span>;
  return <aside className="relative flex min-h-10 items-center overflow-hidden" style={{ backgroundColor: announcement.background, color: announcement.textColor }} aria-label="Announcement"><div className="flex min-w-max animate-announcement-scroll py-3" style={{ animationDuration: `${Math.max(announcement.speed, 10)}s`, animationDirection: announcement.direction === "right" ? "reverse" : "normal" }}>{announcement.link ? <Link href={announcement.link}>{message}</Link> : message}{announcement.link ? <Link href={announcement.link}>{message}</Link> : message}</div><button type="button" onClick={() => setDismissed(true)} className="absolute right-4 top-1/2 z-10 -translate-y-1/2 p-1 transition-opacity hover:opacity-70" aria-label="Dismiss announcement"><X size={15} strokeWidth={1.75} /></button></aside>;
}
