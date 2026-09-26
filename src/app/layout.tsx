import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  Inter,
} from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Caring Chemistry | Thoughtful skincare",
  description: "High-performance skincare for unhurried rituals.",
  icons: {
    icon: "/logo/favicon.svg",
    apple: "/logo/favicon.svg",
    shortcut: "/logo/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${accentSerif.variable} ${body.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}