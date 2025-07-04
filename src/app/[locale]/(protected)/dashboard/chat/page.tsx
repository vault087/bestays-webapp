"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

export default function ChatPage() {
  // Use the useChat hook
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    streamProtocol: "text", // Use text protocol for compatibility with our API
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user" ? "bg-blue-500 text-white" : "border border-gray-200 bg-white text-gray-800"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800">
              <div className="flex space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
