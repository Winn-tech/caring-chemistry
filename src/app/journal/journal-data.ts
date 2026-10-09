export type JournalArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  concern?: string;
  readTime: string;
  date: string;
  publishedAt: string;
  image: string;
  body: string[];
};

export const JOURNAL_CATEGORIES = ["All", "Skincare", "Ingredients", "Routines", "Beauty tips", "Wellness"];

export const JOURNAL_CONCERNS = [
  { label: "Acne", query: "acne", description: "Calm, considered care" },
  { label: "Dry skin", query: "dry-skin", description: "Comfort and replenishment" },
  { label: "Dark spots", query: "dark-spots", description: "A brighter-looking future" },
  { label: "Sensitive skin", query: "sensitive-skin", description: "Less, but better" },
];
