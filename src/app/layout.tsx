import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Caring Chemistry | Thoughtful skincare",
  description: "High-performance skincare for unhurried rituals.",
};




// app/layout.tsx
import { Bricolage_Grotesque, Instrument_Serif, Inter } from "next/font/google";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const accentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-accent",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${accentSerif.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}