"use client";
// app/chat/components/chat-header.tsx
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

export function ChatHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-10 flex items-center gap-3 border-b border-primary-100 bg-primary-50/90 px-4 py-3 backdrop-blur sm:px-6"
    >
      <Link
        href="/shop"
        aria-label="Back to shop"
        className="rounded-full p-1.5 text-primary-700 transition-colors hover:bg-primary-100 hover:text-primary-900"
      >
        <ArrowLeft className="h-[18px] w-[18px]" />
      </Link>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-900 text-accent-500">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-medium text-primary-900">Beauty Assistant</p>
        <p className="text-xs text-primary-600">AI-powered beauty guidance</p>
      </div>
    </motion.header>
  );
}