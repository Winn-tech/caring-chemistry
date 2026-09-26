// app/components/hero-reel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pause, Play, Star } from "lucide-react";

// Drop files into public/video (and optional posters into public/images).
// Keep clips short (6–12s), muted, 1080×1350 or similar 4:5 crop, under ~4MB.
type ReelClip = { src: string; poster?: string; name: string; note: string; href: string };

const REEL: ReelClip[] = [
  {
    src: "/video/hero-1.mp4",
    name: "Product One",
    note: "Serum · Niacinamide",
    href: "/shop",
  },
  {
    src: "/video/hero-2.mp4",
    name: "Product Two",
    note: "Moisturizer · Ceramides",
    href: "/shop",
  },
  {
    src: "/video/hero-3.mp4",
    name: "Product Three",
    note: "Cleanser · Gentle daily",
    href: "/shop",
  },
  {
    src: "/video/hero-4.mp4",
    name: "Novia Soap",
    note: "Body care · Soap",
    href: "/shop?category=body-care",
  },
  {
    src: "/video/hero-5.mp4",
    name: "Product Five",
    note: "Body care · Soap",
    href: "/shop?category=body-care",
  },
];

export function HeroReel() {
  const [active, setActive] = useState(0);
  // null = no choice yet, so fall back to the reduced-motion preference.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldPlay = userPaused === null ? !reduceMotion : !userPaused;
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && shouldPlay) {
        video.play().catch(() => {});
      } else {
        video.pause();
        if (i !== active) video.currentTime = 0;
      }
    });
  }, [active, userPaused]);

  const next = () => {
    setProgress(0);
    setActive((i) => (i + 1) % REEL.length);
  };

  const item = REEL[active];

  return (
    <div
      className="hero-rise relative mx-auto w-full max-w-md"
      style={{ "--hero-delay": "300ms" } as React.CSSProperties}
    >
      {/* arch */}
      <div className="hero-arch relative aspect-[4/5] w-full overflow-hidden rounded-t-full rounded-b-[2.5rem] border border-accent-300/30">
        {REEL.map((clip, i) => (
          <video
            key={clip.src}
            ref={(el) => {
              videos.current[i] = el;
            }}
            src={clip.src}
            poster={clip.poster}
            muted
            playsInline
            loop={REEL.length === 1}
            preload={i === active ? "auto" : "metadata"}
            aria-hidden="true"
            onTimeUpdate={(e) => {
              if (i !== active) return;
              const v = e.currentTarget;
              if (v.duration) setProgress(v.currentTime / v.duration);
            }}
            onPlay={() => i === active && setPlaying(true)}
            onPause={() => i === active && setPlaying(false)}
            onEnded={REEL.length > 1 ? next : undefined}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* tint + inner hairline to seat the video in the palette */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--hero-ink)]/70 via-transparent to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-t-full rounded-b-[2rem] border border-accent-200/20" />

        <button
          type="button"
          onClick={() => setUserPaused(playing)}
          aria-label={playing ? "Pause product video" : "Play product video"}
          className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md outline-none transition-colors hover:bg-black/40 focus-visible:ring-2 focus-visible:ring-accent-200"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
        </button>
      </div>

      {/* floating: rating */}
      <div className="hero-bob absolute -right-2 top-[18%] rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl sm:-right-8">
        <div className="flex gap-0.5 text-accent-300" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-current" />
          ))}
        </div>
        <p className="mt-1.5 text-xs font-medium text-white">15,200+ reviews</p>
      </div>

      {/* floating: current product */}
      <Link
        href={item.href}
        className="hero-bob group absolute -left-2 bottom-[14%] flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 py-3 pl-4 pr-3 shadow-2xl backdrop-blur-xl outline-none [animation-delay:-3s] focus-visible:ring-2 focus-visible:ring-accent-200 sm:-left-10"
      >
        <div aria-live="polite">
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent-200/80">{item.note}</p>
          <p className="font-accent text-lg leading-tight text-white">{item.name}</p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-200 text-[#2a0619] transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </Link>

      {/* reel selector with progress */}
      {REEL.length > 1 && (
        <div className="mx-auto mt-6 flex max-w-xs gap-2" role="tablist" aria-label="Product videos">
          {REEL.map((clip, i) => (
            <button
              key={clip.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={clip.name}
              onClick={() => {
                setProgress(0);
                setActive(i);
              }}
              className="group relative h-6 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-accent-200 rounded"
            >
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15 transition-colors group-hover:bg-white/25">
                <span
                  className="block h-full origin-left bg-accent-300"
                  style={{
                    transform: `scaleX(${i < active ? 1 : i === active ? progress : 0})`,
                  }}
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
