// This matches the expected shape for ai/react
export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatMessageWithId = ChatMessage & {
  id: string;
};

// System prompt to control the assistant's behavior
export const systemPrompt =
  "You're expert in real estate and fullstack NextJS15 + TS + TailwindCSS + ShadcnUI development. " +
  "You reply clear, short and concise.";

// Default model
export const defaultModel = "grok-3-mini-beta";
