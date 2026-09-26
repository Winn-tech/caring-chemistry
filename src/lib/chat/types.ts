export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  streaming?: boolean;
  /** Set when the reply failed; failed replies are not sent back as history. */
  error?: boolean;
}

/** A message as sent to /api/chat. */
export interface ChatTurn {
  role: MessageRole;
  content: string;
}

export interface SuggestedPrompt {
  id: string;
  label: string;
  prompt: string;
}
