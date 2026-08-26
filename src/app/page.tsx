// app/page.tsx
import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { AnnouncementBar } from "./components/announcement-bar";
import "./globals.css";

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Hero />
    </main>
  );
}