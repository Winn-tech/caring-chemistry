// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Rituals", href: "/rituals" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100 bg-[#F7F3EF]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-primary-900"
        >
          Maison Verre
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary-700 transition-colors hover:text-accent-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/shop"
            className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            Shop Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-primary-900 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-primary-100 bg-[#F7F3EF] px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-primary-800"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-accent-500 px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Shop Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}