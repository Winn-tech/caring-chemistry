import { MAX_HISTORY_MESSAGES } from "./constants";
import type { ChatTurn } from "./types";

const FALLBACK_ERROR = "Sorry, I couldn't reply just now. Please try again in a moment.";

/** An error whose message is safe to show the customer. */
class ChatRequestError extends Error {}

type StreamOptions = {
  onChunk: (partial: string) => void;
  signal?: AbortSignal;
};

/** Sends the conversation to /api/chat and reports the reply as it streams in. */
export async function streamChat(turns: ChatTurn[], { onChunk, signal }: StreamOptions) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: turns.slice(-MAX_HISTORY_MESSAGES) }),
    signal,
  });

  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => null);
    // Rate-limit and availability messages are written for customers; anything else gets the generic one.
    const friendly = response.status === 429 || response.status === 503;
    throw new ChatRequestError(friendly && payload?.error ? payload.error : FALLBACK_ERROR);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onChunk(text);
  }

  if (!text.trim()) throw new ChatRequestError(FALLBACK_ERROR);
}

export function chatErrorMessage(error: unknown) {
  return error instanceof ChatRequestError ? error.message : FALLBACK_ERROR;
}
