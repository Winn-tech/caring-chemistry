// app/components/range-reel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";

// Product clips, 1280×720, hosted on Cloudinary (caring-chemistry/video) so their bandwidth isn't
// billed by Netlify. f_auto,q_auto lets Cloudinary pick the format and compression per browser.
const VIDEO_BASE = "https://res.cloudinary.com/cmxayabg/video/upload/f_auto,q_auto/caring-chemistry/video";

// The frame shows a 4:3 slice of each; `focus` is the horizontal object-position that keeps the
// product in view (and, for hero-3, crops out the watermark in its bottom-right corner).
const CLIPS = [
  { src: `${VIDEO_BASE}/hero-1`, name: "Body Treat Clarifying Lotion", focus: "78%" },
  { src: `${VIDEO_BASE}/hero-2`, name: "Maxi Tona Nourishment", focus: "84%" },
  { src: `${VIDEO_BASE}/hero-3`, name: "Maxi Tona Essential Lotion & Cream", focus: "46%" },
  { src: `${VIDEO_BASE}/hero-4`, name: "Novia Exfoliating Soap", focus: "36%" },
  { src: `${VIDEO_BASE}/hero-5`, name: "Novia Moisturising & Beauty Soap", focus: "42%" },
  { src: `${VIDEO_BASE}/hero-6`, name: "Novia Cleansing Soap", focus: "10%" },
];

export function RangeReel() {
  const frame = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  // Clips download only once the section is near the screen, and play only while it's on screen.
  const [armed, setArmed] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  // null = the visitor hasn't pressed play/pause, so follow their reduced-motion setting.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const near = new IntersectionObserver(([entry]) => entry.isIntersecting && setArmed(true), { rootMargin: "400px 0px" });
    const seen = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.25 });
    near.observe(el);
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  const paused = userPaused ?? reduceMotion;
  const playing = armed && onScreen && !paused;

  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && playing) {
        video.play().catch(() => {});
      } else {
        video.pause();
        if (i !== active) video.currentTime = 0;
      }
    });
  }, [active, playing]);

  const next = () => {
    setProgress(0);
    setActive((i) => (i + 1) % CLIPS.length);
  };

  const clip = CLIPS[active];

  return (
    <figure className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#F4F2F0,#E6E2DE)]">
      <div ref={frame} className="relative aspect-[4/3]">
        {CLIPS.map((item, i) => (
          <video
            key={item.src}
            ref={(el) => {
              videos.current[i] = el;
            }}
            src={armed ? item.src : undefined}
            muted
            playsInline
            // The playing clip loads fully; the next one loads its first frame for a smooth hand-over.
            preload={!armed ? "none" : i === active ? "auto" : i === (active + 1) % CLIPS.length ? "metadata" : "none"}
            aria-hidden="true"
            onTimeUpdate={(event) => {
              if (i !== active) return;
              const v = event.currentTarget;
              if (v.duration) setProgress(v.currentTime / v.duration);
            }}
            onEnded={i === active ? next : undefined}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ objectPosition: `${item.focus} 50%`, opacity: i === active ? 1 : 0 }}
          />
        ))}

        <button
          type="button"
          onClick={() => setUserPaused(!paused)}
          aria-label={paused ? "Play product videos" : "Pause product videos"}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-primary-950 backdrop-blur-md outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-primary-950 sm:right-5 sm:top-5"
        >
          {paused ? <Play className="ml-0.5 h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      <figcaption className="relative m-3 overflow-hidden rounded-2xl bg-white sm:m-4">
        <span className="flex items-center justify-between gap-4 px-5 py-3.5">
          {/* Announced only when paused, so autoplay doesn't keep interrupting screen readers. */}
          <span aria-live={playing ? "off" : "polite"} className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-500">
              The range · {String(active + 1).padStart(2, "0")}/{String(CLIPS.length).padStart(2, "0")}
            </span>
            <span className="mt-0.5 block truncate text-base font-bold tracking-tight text-primary-950">{clip.name}</span>
          </span>
          <Link
            href="/shop"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-950 text-white outline-none transition-transform duration-500 hover:rotate-45 focus-visible:ring-2 focus-visible:ring-primary-950 focus-visible:ring-offset-2"
          >
            <ArrowUpRight size={18} aria-hidden="true" />
            <span className="sr-only">Shop the range</span>
          </Link>
        </span>
        {/* how far through the current clip */}
        <span aria-hidden="true" className="block h-[3px] bg-primary-100">
          <span className="block h-full origin-left bg-primary-950 transition-transform duration-300 ease-linear" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </figcaption>
    </figure>
  );
}
