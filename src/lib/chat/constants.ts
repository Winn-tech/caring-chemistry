import type { SuggestedPrompt } from "./types";

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: "routine",
    label: "Help me build a routine",
    prompt: "Can you help me build a skincare routine?",
  },
  {
    id: "product",
    label: "Which product is right for me?",
    prompt: "Which product is right for me?",
  },
  {
    id: "dry-skin",
    label: "I have dry skin",
    prompt: "I have dry skin — what should I use?",
  },
  {
    id: "ingredients",
    label: "Explain an ingredient",
    prompt: "Can you explain what niacinamide does?",
  },
];

/** Only the most recent messages are sent to the model, which keeps each request cheap. */
export const MAX_HISTORY_MESSAGES = 20;
export const MAX_MESSAGE_CHARS = 2000;
