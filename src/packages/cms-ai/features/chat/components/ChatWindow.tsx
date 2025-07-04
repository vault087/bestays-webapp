"use client";
import { useState } from "react";
import { mockMessages } from "@cms-ai/features/chat/mock-data/messages";
import { Message } from "@cms-ai/features/chat/types/Message";
import { MessageRole } from "@cms-ai/features/chat/types/MessageRole";
import { ChatInput } from './ChatInput';

type ChatWindowProps = {
  userId: string;
  chatId: string;
  initialMessages: Message[];
};

export function ChatWindow({ userId, chatId, initialMessages }: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages);

  console.log("ChatWindow.userId", userId);
  console.log("ChatWindow.chatId", chatId);

  const handleInputMessage = (message: string) => {
    console.log("mockMessages", mockMessages);
    mockMessages.push({
      id: messages.length + 1,
      content: message,
      role: MessageRole.USER,
    });
    setMessages([...messages, { id: messages.length + 1, content: message, role: MessageRole.USER }]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div className="flex-1 space-y-2 p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800 shadow"
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto min-w-md pb-2">
        <ChatInput onSendMessage={handleInputMessage} />
      </div>
    </div>
  );
}
