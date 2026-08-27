// app/page.tsx
import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { AnnouncementBar } from "./components/announcement-bar";
import "./globals.css";
import { BestSellers } from "./components/best-sellers";
import { BrandValues } from "./components/brand-values";
import { BeautyJournal } from "./components/beauty-journal";

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <BestSellers/>
      <BeautyJournal />
      <BrandValues/>
    </main>
  );
}