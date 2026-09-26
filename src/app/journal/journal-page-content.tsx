"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { JournalCategories } from "./components/journal-categories";
import { IngredientSpotlight } from "./components/ingredient-spotlight";
import { JournalConcerns } from "./components/journal-concerns";
import { JournalFeatured } from "./components/journal-featured";
import { JournalHero } from "./components/journal-hero";
import { JournalLatest } from "./components/journal-latest";
import { JournalNewsletter } from "./components/journal-newsletter";
import { RoutineBuilder } from "./components/routine-builder";
import type { JournalArticle } from "./journal-data";

export function JournalPageContent({ adminArticles }: { adminArticles: JournalArticle[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");

  return (
    <>
      <JournalHero query={query} onQueryChange={setQuery} />
      <JournalCategories category={category} onCategoryChange={setCategory} />
      <JournalFeatured />
      <JournalLatest query={query} category={category} concern={searchParams.get("concern") ?? ""} adminArticles={adminArticles} />
      <JournalConcerns />
      <IngredientSpotlight />
      <RoutineBuilder />
      <JournalNewsletter />
    </>
  );
}
