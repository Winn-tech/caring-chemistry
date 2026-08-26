"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type AnnouncementBarProps = {
  content?: string;
  background?: string;
  textColor?: string;
  speed?: number;
  direction?: "left" | "right";
  link?: string | null;
  isActive?: boolean;
};

export function AnnouncementBar({
  content = "Complimentary delivery on orders over NGN 50,000",
  background = "#2e2032",
  textColor = "#ffffff",
  speed = 40,
  direction = "left",
  link,
  isActive = true,
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!isActive || dismissed) return null;

  const message = (
    <span className="inline-flex items-center gap-8 whitespace-nowrap px-8 text-xs font-semibold uppercase tracking-[0.16em]">
      <span className="h-1.5 w-1.5 rounded-full bg-accent-300" aria-hidden="true" />
      {content}
    </span>
  );

  return (
    <aside
      className="relative flex min-h-10 items-center overflow-hidden"
      style={{ backgroundColor: background, color: textColor }}
      aria-label="Announcement"
    >
      <div
        className="flex min-w-max animate-announcement-scroll py-3"
        style={{
          animationDuration: `${Math.max(speed, 10)}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {link ? <Link href={link}>{message}</Link> : message}
        {link ? <Link href={link}>{message}</Link> : message}
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 p-1 transition-opacity hover:opacity-70"
        aria-label="Dismiss announcement"
      >
        <X size={15} strokeWidth={1.75} />
      </button>
    </aside>
  );
}