import { Message } from "@cms-ai/features/chat/types/Message";

export const mockMessages: Message[] = [
  {
    id: 1,
    content: "Hello, how are you?",
    role: "user",
  },
  {
    id: 2,
    content: "I'm fine, thank you!",
    role: "assistant",
  },
  {
    id: 3,
    content: "What is your name?",
    role: "user",
  },
];
