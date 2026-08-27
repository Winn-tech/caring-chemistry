export type JournalArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  concern?: string;
  readTime: string;
  date: string;
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

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "build-a-routine-that-actually-works",
    title: "Build a routine that actually works",
    excerpt: "A thoughtful, step-by-step approach to skin that feels as good as it looks.",
    category: "Skincare",
    concern: "dry-skin",
    readTime: "6 min read",
    date: "August 24, 2026",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1600&q=85",
    body: [
      "The best skincare routine is the one you can return to every day. It does not need to be complicated; it needs to be consistent, comfortable, and suited to what your skin is asking for.",
      "Begin with a gentle cleanse, then add one considered treatment for your main concern. Finish with moisture and, in the morning, broad-spectrum SPF. Give each step time to settle before adding another product.",
      "Your skin can change with the seasons, stress, and sleep. Treat your routine as a quiet practice rather than a fixed set of rules, and adjust slowly when something no longer feels right.",
    ],
  },
  {
    slug: "five-ingredients-your-skin-will-love",
    title: "Five ingredients your skin will love",
    excerpt: "The quiet achievers worth knowing before you add another product to your shelf.",
    category: "Ingredients",
    concern: "sensitive-skin",
    readTime: "4 min read",
    date: "August 20, 2026",
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1200&q=85",
    body: [
      "Ingredient lists can feel like a foreign language. The most useful place to begin is with a small group of well-studied ingredients that support the skin barrier and make a visible difference over time.",
      "Ceramides, glycerin, niacinamide, hyaluronic acid, and vitamin C each have a distinct role. Look for formulas that use them thoughtfully, then introduce one new product at a time.",
      "Good skincare is less about collecting ingredients and more about choosing the right ones for your skin, your climate, and your daily rhythm.",
    ],
  },
  {
    slug: "morning-vs-night-your-routine-explained",
    title: "Morning vs night: your routine, explained",
    excerpt: "What your skin needs when the day begins and when it winds down.",
    category: "Routines",
    concern: "dark-spots",
    readTime: "5 min read",
    date: "August 16, 2026",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
    body: [
      "Morning and evening skincare have different jobs. In the morning, your routine prepares and protects. At night, it supports recovery while you sleep.",
      "Keep mornings simple: cleanse if needed, moisturize, and finish with sunscreen. In the evening, remove the day gently before applying your treatment and moisturizer.",
      "A routine that leaves room for real life will always outperform an elaborate one you cannot maintain.",
    ],
  },
  {
    slug: "what-vitamin-c-actually-does",
    title: "What vitamin C actually does",
    excerpt: "A clear guide to one of skincare's most talked-about brightening ingredients.",
    category: "Ingredients",
    concern: "dark-spots",
    readTime: "5 min read",
    date: "August 12, 2026",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85",
    body: [
      "Vitamin C is best known for helping skin look brighter and more even. It is also an antioxidant, which means it helps defend skin from everyday environmental stress.",
      "Start with a gentle formula and use it consistently in the morning beneath sunscreen. If your skin is sensitive, begin a few times a week and build gradually.",
    ],
  },
  {
    slug: "the-gentle-guide-to-exfoliation",
    title: "The gentle guide to exfoliation",
    excerpt: "How to refine your routine without asking too much of your skin.",
    category: "Beauty tips",
    concern: "acne",
    readTime: "4 min read",
    date: "August 08, 2026",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85",
    body: [
      "Exfoliation can help lift away excess buildup, but more is not better. The right rhythm leaves skin feeling smooth and comfortable, never tight or tender.",
      "Choose one exfoliating product, follow its directions, and keep the rest of your routine calm. Your barrier is part of the result.",
    ],
  },
  {
    slug: "small-rituals-for-calmer-skin",
    title: "Small rituals for calmer skin",
    excerpt: "A softer approach to the daily habits that shape how your skin feels.",
    category: "Wellness",
    concern: "sensitive-skin",
    readTime: "3 min read",
    date: "August 03, 2026",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=85",
    body: [
      "Healthy-looking skin is shaped by more than products. Small rituals such as washing with lukewarm water, changing pillowcases, and taking a slower approach can make care feel easier.",
      "Notice what leaves your skin comfortable, then make more room for it. There is plenty of power in a routine that feels peaceful.",
    ],
  },
];

export const FEATURED_ARTICLE = JOURNAL_ARTICLES[0];
export const SPOTLIGHT_ARTICLE = JOURNAL_ARTICLES[3];
