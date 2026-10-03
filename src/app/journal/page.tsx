import { Suspense } from "react";
import { AnnouncementBar } from "../components/announcement-bar";
import { Navbar } from "../components/navbar";
import { JournalPageContent } from "./journal-page-content";
import { getPublishedJournalArticles } from "./journal-posts";

export default async function JournalPage() {
  const adminArticles = await getPublishedJournalArticles();
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Suspense fallback={null}>
        <JournalPageContent adminArticles={adminArticles} />
      </Suspense>
    </main>
  );
}
