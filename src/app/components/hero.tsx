// app/components/hero.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Droplets, MapPin, Pause, Play, Sparkles } from "lucide-react";

// One photo per skin tone, fair to deep. `tone` is the swatch colour, picked from the photo.
// `focus` is the object-position that keeps the face and product in view when the wide photo
// is cropped, both to the tall phone frame and the wider desktop frame.
const SHADES = [
  {
    src: "/images/Estee_maxitone.png",
    tone: "#e9b593",
    product: "Estée Maxitone",
    detail: "Skin Beautifying Milk",
    alt: "Model with closed eyes holding a bottle of Caring Estée Maxitone Skin Beautifying Milk to her cheek",
    focus: "88% 50%",
  },
  {
    src: "/images/White_Opal_Banner.png",
    tone: "#d9935f",
    product: "White Opal Carotene",
    detail: "Lotion with protective sunscreens",
    alt: "Smiling model holding a bottle of White Opal Carotene lotion beside her face",
    focus: "3% 50%",
  },
  {
    src: "/images/body-treat.png",
    tone: "#b8714a",
    product: "Body Treat",
    detail: "Intensive Dry Skin & Nourishing Complex",
    alt: "Model with closed eyes holding a jar of Body Treat nourishing complex under her chin",
    focus: "0% 50%",
  },
  {
    src: "/images/Radience_1.png",
    tone: "#8a4a2c",
    product: "Radiance",
    detail: "Complexion Enhancement & Nourishing Cream",
    alt: "Model holding a jar of Radiance complexion cream to her chin",
    focus: "100% 50%",
  },
  {
    src: "/images/Radience.png",
    tone: "#6e3b24",
    product: "Radiance",
    detail: "Complexion Enhancement & Nourishing Cream",
    alt: "Model applying cream to her cheek while holding a jar of Radiance complexion cream",
    focus: "98% 50%",
  },
];

// How long each photo shows. The progress bar's CSS animation runs for this long and its end
// moves to the next photo, so pausing the bar also pauses the rotation, with no drift between them.
const SHADE_MS = 6000;

const BRAND_POINTS = [
  { icon: Sparkles, label: "Formulated for every skin tone" },
  { icon: Droplets, label: "Face & body care essentials" },
  { icon: MapPin, label: "In our stores & with trusted retailers" },
];

export function Hero() {
  const [active, setActive] = useState(0);
  // null = the visitor hasn't pressed play/pause yet, so follow their reduced-motion setting.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const paused = userPaused ?? reduceMotion;
  const running = !paused && !focused;
  const shade = SHADES[active];

  const show = (index: number) => setActive((index + SHADES.length) % SHADES.length);

  return (
    <section
      aria-label="Introduction"
      className="relative isolate overflow-hidden bg-[#FAF7F3]"
      // Keyboard users get time to read: rotation holds while keyboard focus is in the hero.
      // Mouse clicks don't count (they don't match :focus-visible), so the Play button still works.
      onFocus={(event) => setFocused(event.target.matches(":focus-visible"))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      {/* soft blush glow that picks up the active skin tone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 -z-10 h-[38rem] w-[38rem] rounded-full opacity-25 blur-3xl transition-colors duration-1000"
        style={{ backgroundColor: shade.tone }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-14 pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:px-10 lg:pb-20 lg:pt-14">
        {/* copy */}
        <div>
          <p
            className="hero-rise inline-flex items-center gap-2.5 rounded-full border border-primary-100 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] whitespace-nowrap text-primary-800"
            style={{ "--hero-delay": "0ms" } as React.CSSProperties}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            For every skin tone
          </p>

          <h1
            className="hero-rise mt-7 font-display text-[3.25rem] leading-[0.92] tracking-[-0.05em] text-primary-950 sm:text-7xl lg:text-6xl xl:text-[5rem]"
            style={{ "--hero-delay": "120ms" } as React.CSSProperties}
          >
            <span className="block font-light">Beauty in</span>
            <span className="block font-bold">
              every <span className="hero-shade-text">shade.</span>
            </span>
          </h1>

          <p
            className="hero-rise mt-7 max-w-md text-base leading-relaxed text-primary-900/80 sm:text-lg"
            style={{ "--hero-delay": "240ms" } as React.CSSProperties}
          >
            Skincare formulated and tested across the full spectrum of skin tones. Safe, effective and made for you.
          </p>

          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
            style={{ "--hero-delay": "360ms" } as React.CSSProperties}
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-primary-950 py-2 pl-7 pr-2 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(168,7,99,0.6)] outline-none transition-colors hover:bg-primary-800 focus-visible:ring-2 focus-visible:ring-primary-950 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF7F3]"
            >
              Shop the Collection
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
            <Link
              href="/ritual#ritual-finder"
              className="group relative rounded text-sm font-semibold text-primary-950 outline-none focus-visible:ring-2 focus-visible:ring-primary-950 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF7F3]"
            >
              Find your ritual
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-primary-950/40 transition-transform duration-500 group-hover:scale-x-0" />
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-primary-950 transition-transform delay-150 duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          </div>

          <ul
            className="hero-rise mt-12 hidden max-w-md space-y-3 border-t border-primary-100 pt-6 lg:block"
            style={{ "--hero-delay": "480ms" } as React.CSSProperties}
          >
            {BRAND_POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-primary-900/75">
                <Icon size={16} className="shrink-0 text-accent-600" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* visual */}
        <div
          className="hero-rise"
          style={{ "--hero-delay": "200ms" } as React.CSSProperties}
        >
          <div className="relative">
            {/* backplate in the active skin tone */}
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] rounded-tl-[7rem] transition-colors duration-1000 sm:translate-x-5 sm:translate-y-5 sm:rounded-tl-[11rem]"
              style={{ backgroundColor: shade.tone }}
            />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] rounded-tl-[7rem] bg-primary-100 sm:aspect-[5/4] sm:rounded-tl-[11rem]">
              {SHADES.map((item, i) => (
                <Image
                  key={item.src}
                  src={item.src}
                  alt={i === active ? item.alt : ""}
                  aria-hidden={i !== active}
                  fill
                  sizes="(min-width: 1280px) 720px, (min-width: 1024px) 56vw, 100vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  className="object-cover"
                  style={{
                    objectPosition: item.focus,
                    opacity: i === active ? 1 : 0,
                    // The shown photo drifts slowly in; a hidden one resets its zoom only after it has faded out.
                    transform: i === active || reduceMotion ? "scale(1)" : "scale(1.06)",
                    transition:
                      i === active
                        ? "opacity 1.1s ease-out, transform 7s ease-out"
                        : "opacity 1.1s ease-out, transform 0s linear 1.1s",
                  }}
                />
              ))}

              {/* counter */}
              <p
                aria-hidden="true"
                className="absolute right-5 top-5 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold tabular-nums text-primary-950 backdrop-blur-md"
              >
                {String(active + 1).padStart(2, "0")}
                <span className="mx-1 text-primary-300">/</span>
                {String(SHADES.length).padStart(2, "0")}
              </p>

              {/* what's in the photo */}
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
                <Link
                  href="/shop"
                  className="group relative max-w-[17rem] overflow-hidden rounded-2xl bg-white/90 py-3.5 pl-4 pr-12 shadow-[0_18px_40px_-20px_rgba(46,32,50,0.55)] backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-primary-950"
                >
                  {/* Announced only when paused, so autoplay doesn't keep interrupting screen readers. */}
                  <span aria-live={running ? "off" : "polite"} className="block">
                    <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-500">
                      <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: shade.tone }} />
                      Featured
                    </span>
                    <span className="mt-1 block text-base font-bold leading-tight text-primary-950">{shade.product}</span>
                    <span className="mt-0.5 block truncate text-xs text-primary-900/70">{shade.detail}</span>
                  </span>
                  <span className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary-950 text-white transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Shop now</span>
                  </span>
                  {/* time left on this photo */}
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-primary-100">
                    <span
                      key={active}
                      className="hero-progress block h-full origin-left bg-primary-950"
                      style={{
                        animationDuration: `${SHADE_MS}ms`,
                        animationPlayState: running ? "running" : "paused",
                      }}
                      onAnimationEnd={() => show(active + 1)}
                    />
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setUserPaused(!paused)}
                  aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/85 text-primary-950 backdrop-blur-md outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-primary-950"
                >
                  {paused ? <Play className="ml-0.5 h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>

          {/* shade swatches */}
          <div className="mt-9 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 sm:mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              Made for every shade
            </p>
            <div role="group" aria-label="Choose a photo" className="flex items-center gap-3">
              {SHADES.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => show(i)}
                  aria-pressed={i === active}
                  aria-label={`Photo ${i + 1} of ${SHADES.length}: ${item.product}`}
                  className={`h-9 w-9 rounded-full ring-offset-[3px] ring-offset-[#FAF7F3] outline-none transition-[transform,box-shadow] duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary-950 sm:h-10 sm:w-10 ${
                    i === active ? "scale-110 ring-2 ring-primary-950" : "ring-1 ring-black/10"
                  }`}
                  style={{ backgroundColor: item.tone }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
