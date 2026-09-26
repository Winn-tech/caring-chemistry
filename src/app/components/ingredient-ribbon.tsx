// app/components/ingredient-ribbon.tsx
"use client";

import { useEffect, useRef } from "react";

const SPEED = 30; // px per second
const RESUME_AFTER = 2500; // ms after the user lets go
const COPIES = 4; // enough repeats to fill wide screens and loop seamlessly

export function IngredientRibbon({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  const held = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pos = el.scrollLeft;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (held.current) {
        pos = el.scrollLeft; // pick up wherever the user swiped to
      } else {
        const period = el.scrollWidth / COPIES;
        pos += SPEED * dt;
        if (pos >= period) pos -= period; // copies are identical, so this jump is invisible
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resumeTimer.current);
    };
  }, []);

  const hold = () => {
    clearTimeout(resumeTimer.current);
    held.current = true;
  };
  const release = () => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => (held.current = false), RESUME_AFTER);
  };

  return (
    <div className="border-y border-white/10 bg-white/[0.02] py-4">
      <p className="sr-only">Key ingredients: {items.join(", ")}</p>
      <div
        ref={track}
        aria-hidden="true"
        onPointerEnter={hold}
        onPointerLeave={release}
        onTouchStart={hold}
        onTouchEnd={release}
        onWheel={() => {
          hold();
          release();
        }}
        className="flex touch-pan-x overflow-x-auto overscroll-x-contain [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex shrink-0 items-center">
          {Array.from({ length: COPIES }, () => items).flat().map((name, i) => (
            <span
              key={i}
              className="flex items-center gap-10 whitespace-nowrap pr-10 font-accent text-lg text-accent-100/75 sm:text-xl"
            >
              {name}
              <span className="text-xs text-accent-400/60">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
