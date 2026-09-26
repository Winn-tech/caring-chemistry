"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ChatMessage } from "@/lib/chat/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

// The assistant links products as [Name](/product/slug), articles as
// [Title](/journal/slug), and the homepage best sellers as /#best-sellers.
// Only these internal links become anchors; anything else stays plain text.
const INTERNAL_LINK = /\[([^\]\n]+)\]\((\/(?:product|journal)\/[a-z0-9-]+|\/#best-sellers)\)/g;

function renderContent(content: string) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(INTERNAL_LINK)) {
    const [full, label, href] = match;
    parts.push(content.slice(lastIndex, match.index));
    parts.push(
      <Link
        key={match.index}
        href={href}
        className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-900"
      >
        {label}
      </Link>
    );
    lastIndex = match.index + full.length;
  }

  parts.push(content.slice(lastIndex));
  return parts;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-900 text-accent-500">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
      )}
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-br-sm bg-primary-900 text-primary-50"
            : "rounded-bl-sm border border-primary-100 bg-white text-primary-900"
        }`}
      >
        {isUser ? message.content : renderContent(message.content)}
      </div>
    </motion.div>
  );
}
