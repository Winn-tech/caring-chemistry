import { z } from "zod";
import { ApiError, errorResponse } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/security";
import { getArticlesForAssistant, getCatalogForAssistant } from "@/lib/chat/catalog";
import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_CHARS } from "@/lib/chat/constants";
import { streamAssistantReply } from "@/lib/chat/gemini";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";

const turn = z.discriminatedUnion("role", [
  z.object({ role: z.literal("user"), content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS) }),
  // Assistant replies are longer than customer messages; this only bounds abuse.
  z.object({ role: z.literal("assistant"), content: z.string().trim().min(1).max(8000) }),
]);

const schema = z.object({ messages: z.array(turn).min(1).max(100) });

export async function POST(request: Request) {
  try {
    await rateLimit(`chat:${clientIp(request)}`, 30, 10 * 60 * 1000);

    const { messages } = schema.parse(await request.json());
    const turns = messages.slice(-MAX_HISTORY_MESSAGES);
    // The model expects the conversation to open with the customer.
    while (turns[0]?.role === "assistant") turns.shift();
    if (turns.at(-1)?.role !== "user") throw new ApiError(422, "The last message must come from the customer.");

    const [catalog, articles] = await Promise.all([getCatalogForAssistant(), getArticlesForAssistant()]);
    const systemPrompt = buildSystemPrompt(catalog, articles);
    const reply = streamAssistantReply(systemPrompt, turns);

    // Wait for the first piece of the reply so provider errors (quota, bad key)
    // come back as a proper error status instead of a broken stream.
    const first = await reply.next();
    const encoder = new TextEncoder();

    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        if (!first.done) controller.enqueue(encoder.encode(first.value));
      },
      async pull(controller) {
        try {
          const { value, done } = await reply.next();
          if (done) controller.close();
          else controller.enqueue(encoder.encode(value));
        } catch (error) {
          console.error("Chat stream failed", error);
          controller.error(error);
        }
      },
      async cancel() {
        await reply.return(undefined);
      },
    });

    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
