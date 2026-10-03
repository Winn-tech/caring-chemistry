// components/Navbar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  {
    label: "Shop",
    href: "/shop",
    eyebrow: "The collection",
    description: "Browse the formulas that make everyday care feel thoughtful, simple, and effective.",
    feature: "Shop the essentials",
    children: [
      { label: "Shop All Beauty", href: "/shop", description: "See the full collection" },
      { label: "Cleansers", href: "/shop?category=cleansers", description: "Daily reset" },
      { label: "Serums", href: "/shop?category=serums", description: "Targeted support" },
      { label: "Moisturizers", href: "/shop?category=moisturizers", description: "Comfort and balance" },
      { label: "Body Care", href: "/shop?category=body-care", description: "Everyday nourishment" },
      { label: "Essentials", href: "/shop?category=essentials", description: "The core ritual" },
    ],
  },
  {
    label: "Ritual",
    href: "/ritual",
    eyebrow: "A little care",
    description: "Simple steps, considered ingredients, and a routine that works with your skin.",
    feature: "Build a ritual that feels like yours",
    children: [
      { label: "The Daily Steps", href: "/ritual#daily-ritual", description: "Morning and evening rhythm" },
      { label: "Find Your Ritual", href: "/ritual#ritual-finder", description: "Personalized guidance" },
      { label: "Ingredient Notes", href: "/ritual#ingredients", description: "What goes on your skin" },
      { label: "A Little Guidance", href: "/ritual#ritual-faq", description: "Simple answers" },
    ],
  },
  {
    label: "Journal",
    href: "/journal",
    eyebrow: "Notes & guidance",
    description: "Explore skincare stories, ingredient explainers, and everyday rituals that make sense.",
    feature: "Read the latest from the journal",
    children: [
      { label: "Latest Stories", href: "/journal#latest-stories", description: "Fresh reads" },
      { label: "Explore by Concern", href: "/journal#journal-concerns", description: "Find what you need" },
      { label: "Ingredient Spotlight", href: "/journal#ingredient-spotlight", description: "Understand the formulas" },
      { label: "Routine Builder", href: "/journal#routine-builder", description: "Build your flow" },
    ],
  },
  {
    label: "Beauty AI Assistant",
    href: "/chat",
    eyebrow: "Personal guidance",
    description: "Get product suggestions and routine support from a beauty-first assistant.",
    feature: "Start a conversation about your skin",
    children: [
      { label: "Beauty Assistant", href: "/chat", description: "Open the assistant" },
      { label: "Routine Help", href: "/chat", description: "Build your routine" },
      { label: "Skin Concerns", href: "/chat", description: "Talk through your goals" },
      { label: "Product Match", href: "/chat", description: "Find the right fit" },
    ],
  },
  {
    label: "About",
    href: "/about",
    eyebrow: "Who we are",
    description: "Our story, philosophy, ingredients, and the standards behind every formula.",
    feature: "Learn what informs everything we make",
    children: [
      { label: "Our Story", href: "/about#our-story", description: "The beginning" },
      { label: "Our Philosophy", href: "/about#our-philosophy", description: "What we believe" },
      { label: "What Makes Us Different", href: "/about#what-makes-us-different", description: "Why we do things differently" },
    ],
  },
] as const;

type NavLink = (typeof NAV_LINKS)[number];
type MegaLink = Extract<NavLink, { children: readonly unknown[] }>;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const activeLink = NAV_LINKS.find((l) => l.label === activeLabel && "children" in l && l.children) as
    | MegaLink
    | undefined;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the route changes. Done during render (React's "adjust state on prop change"
  // pattern) rather than in an effect, which would first paint the stale open menu.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setActiveLabel(null);
    setMobileOpen(false);
  }

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveLabel(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveLabel(null), 120);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-[#FAF7F3]/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_0_rgba(31,27,29,0.08)]" : ""
      }`}
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:py-5 lg:px-10">
        <Link href="/" className="group flex items-center gap-2" aria-label="Caring Chemistry home">
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
            <Image src="/logo/Caring_Chemistry_Logo.png" alt="" width={64} height={64} priority />
          </span>
          <span className="hidden font-display text-lg font-semibold tracking-tight text-primary-950 sm:block">
            Caring Chemistry
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <div key={link.href} onMouseEnter={() => openMenu(link.label)}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                aria-expanded={"children" in link && link.children ? activeLabel === link.label : undefined}
                className={`relative rounded-full px-4 py-2 text-[16px] font-medium transition-colors duration-200 ${
                  isActive(link.href) || activeLabel === link.label
                    ? "bg-primary-950 text-white"
                    : "text-primary-800 hover:bg-primary-100/70"
                }`}
              >
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/shop"
            aria-current={isActive("/shop") ? "page" : undefined}
            className="rounded-full border border-primary-950 px-5 py-2.5 text-[13.5px] font-semibold text-primary-950 transition-colors duration-200 hover:bg-primary-950 hover:text-white"
          >
            Shop now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="text-primary-900 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`absolute inset-x-0 top-full overflow-hidden border-t border-primary-100 bg-[#FAF7F3] shadow-[0_18px_34px_rgba(31,27,29,0.08)] transition-opacity duration-200 ease-out ${
          activeLink ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onMouseEnter={() => activeLink && openMenu(activeLink.label)}
      >
        {activeLink && <MegaMenuContent key={activeLink.label} link={activeLink} isActive={isActive} />}
      </div>

      {mobileOpen && (
        <div className="border-t border-primary-100 bg-[#FAF7F3] px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-1 pt-4">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="flex flex-col gap-1">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`rounded-xl px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive(link.href) ? "bg-primary-950 text-white" : "text-primary-800 hover:bg-primary-100/70"
                  }`}
                >
                  {link.label}
                </Link>
                {"children" in link && link.children && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-primary-100 pl-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive(child.href) ? "page" : undefined}
                        className="py-1.5 text-sm text-primary-700 transition-colors hover:text-accent-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="mt-3 rounded-full bg-primary-950 px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Shop now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function MegaMenuContent({ link, isActive }: { link: MegaLink; isActive: (href: string) => boolean }) {
  // Freshly mounted each time `link` changes (the parent keys this component
  // by label), so `entered` always starts false and flips true a frame later —
  // that's what makes the panel animate in on every hover, not just the first.
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`mx-auto grid  max-w-7xl gap-10 overflow-hidden px-6 py-10 transition-all duration-300 ease-out lg:grid-cols-[1fr_2fr_0.85fr] lg:px-10 ${
        entered ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-[0.98] opacity-0"
      }`}
    >
      <div className="flex flex-col justify-between border-r border-primary-100 pr-10">
        <div>
          <p className="font-accent text-base italic text-accent-600">{link.eyebrow}</p>
          <p className="mt-3 max-w-xs font-display text-[26px] font-semibold leading-tight text-primary-950">
            {link.feature}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-700">{link.description}</p>
        </div>
        <Link
          href={link.href}
          className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-950 transition-colors hover:text-accent-700"
        >
          Explore {link.label}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <nav aria-label={`${link.label} submenu`} className="grid gap-3 sm:grid-cols-2">
        {link.children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            aria-current={isActive(child.href) ? "page" : undefined}
            className="flex min-h-[88px] flex-col justify-end rounded-2xl border border-primary-100 bg-white/60 p-4 transition-colors duration-200 hover:border-accent-300 hover:bg-primary-50"
          >
            <span className={`text-sm font-semibold ${isActive(child.href) ? "text-accent-700" : "text-primary-900"}`}>
              {child.label}
            </span>
            <span className="mt-1 text-xs text-primary-500">{child.description}</span>
          </Link>
        ))}
      </nav>

      <div className="hidden min-h-[176px] flex-col justify-end rounded-2xl bg-primary-950 p-6 text-white lg:flex">
        <span className="font-accent text-4xl italic text-accent-300">{link.label === "Shop" ? "care" : "daily"}</span>
        <span className="mt-2 text-xs leading-relaxed text-primary-200">
          Made for slower mornings, softer evenings, and everything in between.
        </span>
      </div>
    </div>
  );
}