// app/chat/page.tsx
import type { Metadata } from "next";
import { Navbar } from "../components/navbar";
import { ChatShell } from "./components/chat-shell";

export const metadata: Metadata = {
  title: "Beauty Assistant | Caring Chemistry",
  description:
    "Chat with our beauty assistant to find products and build a routine that fits your skin.",
};

export default function ChatPage() {
  return (
    <main>
      <Navbar />
      <ChatShell />
    </main>
  );
}