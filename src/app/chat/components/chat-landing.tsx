"use client";
// app/chat/components/chat-landing.tsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ChatInput } from "./chat-input";
import { SuggestedPrompts } from "./suggested-prompts";
import type { SuggestedPrompt } from "@/lib/chat/types";

interface ChatLandingProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSelectPrompt: (prompt: SuggestedPrompt) => void;
}

export function ChatLanding({ value, onChange, onSend, onSelectPrompt }: ChatLandingProps) {
  return (
    <div className="mx-auto flex min-h-[85vh] max-w-[560px] flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-primary-900 px-3 py-1.5 text-xs font-medium text-accent-500"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Beauty Assistant
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-3xl text-primary-950 sm:text-4xl"
      >
        Your skin, your routine, simplified.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 max-w-sm text-[15px] leading-relaxed text-primary-700/80"
      >
        Tell me what you&apos;re looking for and I&apos;ll help you discover products
        and build a routine that fits your needs.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 w-full rounded-2xl border border-primary-100 bg-white p-4 text-left shadow-sm shadow-primary-900/5 sm:p-5"
      >
        <div className="flex items-start gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-900 text-accent-500">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <p className="pt-1 text-sm text-primary-800">
            Hi! I&apos;m your beauty assistant. What can I help you with today?
          </p>
        </div>

        <div className="mt-4">
          <SuggestedPrompts onSelect={onSelectPrompt} />
        </div>

        <div className="mt-4">
          <ChatInput value={value} onChange={onChange} onSend={onSend} variant="embedded" />
        </div>
      </motion.div>
    </div>
  );
}