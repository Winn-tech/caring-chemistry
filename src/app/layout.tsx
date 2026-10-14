import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  Inter,
} from "next/font/google";
import { COMPANY_ADDRESS, COMPANY_SOCIAL_URLS } from "@/lib/company";
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

// Lets search engines show the company's address and social profiles.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Caring Chemistry",
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY_ADDRESS.street,
    addressLocality: COMPANY_ADDRESS.city,
    addressRegion: COMPANY_ADDRESS.region,
    addressCountry: COMPANY_ADDRESS.countryCode,
  },
  sameAs: COMPANY_SOCIAL_URLS,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${accentSerif.variable} ${body.variable}`}
    >
      <body className="font-body">
        <script
          type="application/ld+json"
          // Static company details for search engines; nothing user-supplied goes in here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}