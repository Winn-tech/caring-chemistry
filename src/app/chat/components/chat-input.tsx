"use client";

import { useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  variant?: "embedded" | "pinned";
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  variant = "embedded",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) onSend();
    }
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <motion.div
      layoutId="chat-input"
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className={
        variant === "pinned"
          ? "sticky bottom-0 border-t border-primary-100 bg-primary-50/95 px-4 py-3 backdrop-blur sm:px-6"
          : ""
      }
    >
      <div
        className={`flex items-end gap-2 rounded-xl border border-primary-100 bg-white px-3 py-2 transition-colors focus-within:border-primary-300 ${
          variant === "pinned" ? "mx-auto max-w-[900px]" : ""
        }`}
      >
        <label htmlFor="chat-message" className="sr-only">
          Message
        </label>
        <textarea
          ref={textareaRef}
          id="chat-message"
          rows={1}
          value={value}
          disabled={disabled}
          placeholder="Ask about your skin, products, or ingredients..."
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-sm text-primary-900 placeholder:text-primary-400 focus:outline-none disabled:opacity-60"
        />
        <button
          type="button"
          aria-label="Send message"
          disabled={!canSend}
          onClick={onSend}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-900 text-primary-50 transition-colors disabled:cursor-not-allowed disabled:bg-primary-100 disabled:text-primary-400"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
