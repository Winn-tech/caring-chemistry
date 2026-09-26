// app/components/footer/index.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, AtSign, Camera, CirclePlay, MapPin } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
import { BackToTop } from "./back-to-top";
import { FooterItem, FooterStagger, FooterWordmark } from "./footer-motion";

const LINK_GROUPS = [
  {
    heading: "Shop",
    links: [
      { label: "Shop all", href: "/shop" },
      { label: "Best sellers", href: "/shop?sort=best-selling" },
      { label: "New arrivals", href: "/shop?sort=newest" },
      { label: "Cleansers", href: "/shop?category=cleansers" },
      { label: "Serums", href: "/shop?category=serums" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Your daily ritual", href: "/ritual" },
      { label: "Beauty journal", href: "/journal" },
      { label: "Beauty assistant", href: "/chat" },
      { label: "Find a store", href: "/stores" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our story", href: "/about#our-story" },
      { label: "Our philosophy", href: "/about#our-philosophy" },
      { label: "What makes us different", href: "/about#what-makes-us-different" },
    ],
  },
];

const SOCIALS = [
  { icon: Camera, href: "https://instagram.com", label: "Instagram" },
  { icon: AtSign, href: "https://twitter.com", label: "Twitter" },
  { icon: CirclePlay, href: "https://youtube.com", label: "YouTube" },
];

const linkUnderline =
  "relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent-300 after:transition-transform after:duration-300 hover:after:scale-x-100";

export function Footer() {
  return (
    <footer className="w-full">
      <div className="relative isolate w-full overflow-hidden bg-primary-950 text-white">
        {/* slow-drifting brand glows */}
        <div aria-hidden className="footer-glow pointer-events-none absolute -left-32 -top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary-700/35 blur-[120px]" />
        <div aria-hidden className="footer-glow footer-glow-alt pointer-events-none absolute -bottom-48 -right-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-accent-500/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-6 pt-16 sm:pt-20 lg:px-12">
          {/* newsletter */}
          <FooterStagger className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
            <FooterItem>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-300">The beauty list</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                Skin care worth <span className="font-accent font-normal italic text-accent-200">staying in</span> for.
              </h2>
            </FooterItem>
            <FooterItem>
              <p className="mb-5 max-w-md text-sm leading-relaxed text-white/60">
                Calm, useful guidance, ingredient notes and first access to new formulas. No noise, unsubscribe anytime.
              </p>
              <NewsletterForm />
            </FooterItem>
          </FooterStagger>

          {/* brand + links */}
          <FooterStagger className="grid gap-12 py-14 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <FooterItem>
              <Link href="/" className="group inline-flex items-center gap-3" aria-label="Caring Chemistry home">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6">
                  <Image src="/logo/Caring_Chemistry_Logo.png" alt="" width={48} height={48} />
                </span>
                <span className="font-display text-xl font-semibold tracking-tight">Caring Chemistry</span>
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
                High-performance skincare for unhurried rituals. Thoughtfully considered, simply explained.
              </p>
              <div className="mt-7 flex items-center gap-3">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-accent-300 hover:bg-accent-300 hover:text-[#2e2032]"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </FooterItem>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              {LINK_GROUPS.map((group) => (
                <FooterItem key={group.heading}>
                  <p className="font-accent text-lg italic text-accent-200">{group.heading}</p>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={`${linkUnderline} text-sm text-white/70 transition-colors hover:text-white`}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </FooterItem>
              ))}

              <FooterItem className="col-span-2 sm:col-span-3">
                <Link
                  href="/stores"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-colors duration-300 hover:border-accent-300/50 hover:bg-white/10"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-300/15 text-accent-300">
                      <MapPin size={16} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">Where to buy</span>
                      <span className="block text-xs text-white/55">Verified retail partners and stores near you</span>
                    </span>
                  </span>
                  <ArrowUpRight size={18} className="shrink-0 text-accent-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </FooterItem>
            </div>
          </FooterStagger>
        </div>

        {/* signature wordmark */}
        <div className="px-4">
          <FooterWordmark text="Caring Chemistry" />
        </div>

        {/* bottom bar */}
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/10 px-6 py-6 text-xs text-white/45 sm:flex-row lg:px-12">
          <p>© {new Date().getFullYear()} Caring Chemistry. All rights reserved.</p>
          <p className="font-accent text-sm italic text-white/55">Small moments. Lasting care.</p>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}
