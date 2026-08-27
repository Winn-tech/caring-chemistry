import { Suspense } from "react";
import { AnnouncementBar } from "../components/announcement-bar";
import { Navbar } from "../components/navbar";
import { JournalPageContent } from "./journal-page-content";

export default function JournalPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Suspense fallback={null}>
        <JournalPageContent />
      </Suspense>
    </main>
  );
}
