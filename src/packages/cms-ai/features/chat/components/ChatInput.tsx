"use client";
import { useState } from "react";
export function ChatInput({ onSendMessage }: { onSendMessage: (message: string) => void }) {
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="rounded-2xl border border-gray-300 px-2 shadow-2xl">
      <input
        placeholder="Ask me anything"
        type="text"
        className="p-2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className="text-sm hover:text-gray-500" onClick={handleSendMessage} type="button">
        Send
      </button>
    </div>
  );
}
