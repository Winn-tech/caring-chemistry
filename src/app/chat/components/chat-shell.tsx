"use client";
// app/chat/components/chat-shell.tsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatHeader } from "./chat-header";
import { ChatLanding } from "./chat-landing";
import { MessageThread } from "./message-thread";
import { ChatInput } from "./chat-input";
import { chatErrorMessage, streamChat } from "@/lib/chat/client";
import type { ChatMessage, ChatTurn, SuggestedPrompt } from "@/lib/chat/types";

let idCounter = 0;
const nextId = () => `msg-${++idCounter}`;

export function ChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const hasStarted = messages.length > 0;

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = { id: nextId(), role: "user", content: trimmed };
    const assistantMessage: ChatMessage = {
      id: nextId(),
      role: "assistant",
      content: "",
      streaming: true,
    };

    // Failed replies stay on screen but are not sent back to the model.
    const history: ChatTurn[] = [...messages, userMessage]
      .filter((m) => !m.error && m.content.trim())
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsStreaming(true);

    const updateReply = (patch: Partial<ChatMessage>) =>
      setMessages((prev) => prev.map((m) => (m.id === assistantMessage.id ? { ...m, ...patch } : m)));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(history, {
        signal: controller.signal,
        onChunk: (partial) => updateReply({ content: partial }),
      });
      updateReply({ streaming: false });
    } catch (error) {
      if (controller.signal.aborted) return;
      updateReply({ content: chatErrorMessage(error), streaming: false, error: true });
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setIsStreaming(false);
    }
  }

  function handleSelectPrompt(prompt: SuggestedPrompt) {
    send(prompt.prompt);
  }

  return (
    <div className="flex min-h-screen flex-col bg-primary-50">
      <AnimatePresence mode="wait" initial={false}>
        {!hasStarted ? (
          <motion.div
            key="landing"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <ChatLanding
              value={input}
              onChange={setInput}
              onSend={() => send(input)}
              onSelectPrompt={handleSelectPrompt}
            />
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex flex-1 flex-col"
          >
            <ChatHeader />
            <div className="flex-1 overflow-y-auto">
              <MessageThread messages={messages} />
            </div>
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={() => send(input)}
              disabled={isStreaming}
              variant="pinned"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}