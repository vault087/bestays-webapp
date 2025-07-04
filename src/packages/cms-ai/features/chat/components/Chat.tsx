import { mockMessages } from "@cms-ai/features/chat/mock-data/messages";
import { ChatWindow } from './ChatWindow';

type ChatProps = {
  userId: string;
  chatId: string | undefined;
};

export async function Chat({ userId, chatId = undefined }: ChatProps) {
  // await config();
  return <ChatWindow userId={userId} chatId={chatId ?? ""} initialMessages={mockMessages} />;
}
