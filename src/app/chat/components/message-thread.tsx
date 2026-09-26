"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import type { ChatMessage } from "@/lib/chat/types";

interface MessageThreadProps {
  messages: ChatMessage[];
}

export function MessageThread({ messages }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div
      aria-live="polite"
      className="mx-auto flex max-w-[900px] flex-col gap-4 px-4 py-6 sm:px-6"
    >
      <AnimatePresence initial={false}>
        {messages.map((message) =>
          message.role === "assistant" && message.streaming && message.content === "" ? (
            <TypingIndicator key={message.id} />
          ) : (
            <MessageBubble key={message.id} message={message} />
          )
        )}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
