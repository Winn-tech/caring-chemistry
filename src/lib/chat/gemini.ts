import { ApiError as GeminiApiError, GoogleGenAI } from "@google/genai";
import { ApiError } from "@/lib/api";
import type { ChatTurn } from "./types";

// The only file that knows which AI provider powers the assistant. To switch
// providers, reimplement streamAssistantReply with the same signature.
const DEFAULT_MODEL = "gemini-3.5-flash-lite";

let client: GoogleGenAI | null = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new ApiError(503, "The beauty assistant is not available right now.");
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

export async function* streamAssistantReply(systemPrompt: string, turns: ChatTurn[]) {
  let stream;
  try {
    stream = await getClient().models.generateContentStream({
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      contents: turns.map((turn) => ({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.content }],
      })),
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        maxOutputTokens: 1024,
      },
    });
  } catch (error) {
    if (error instanceof GeminiApiError && error.status === 429) {
      throw new ApiError(503, "The beauty assistant is busy right now. Please try again in a minute.");
    }
    throw error;
  }

  let usage;
  for await (const chunk of stream) {
    usage = chunk.usageMetadata ?? usage;
    if (chunk.text) yield chunk.text;
  }
  // Shows in the function logs: what each reply cost, and how much of the prompt Gemini's
  // automatic caching served at the discounted rate.
  if (usage) {
    console.info("Chat tokens", { prompt: usage.promptTokenCount, cached: usage.cachedContentTokenCount ?? 0, reply: usage.candidatesTokenCount, thinking: usage.thoughtsTokenCount ?? 0 });
  }
}
