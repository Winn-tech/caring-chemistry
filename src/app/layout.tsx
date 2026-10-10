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
  // Browser icons come from the file conventions in this folder: favicon.ico, icon.png and
  // apple-icon.png, all generated from the round brand logo. Next.js adds the tags automatically.
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