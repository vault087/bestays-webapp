// "use server";

export function getChatService(): string {
  return "ok";
}

// import OpenAI from "openai";
// import { ChatMessage, defaultModel } from "./chat-service-types";

// // Create OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.X_AI_API_KEY!,
//   baseURL: "https://api.x.ai/v1",
// });

// /**
//  * Validates that all messages have the required fields
//  */
// function validateMessages(messages: ChatMessage[]): boolean {
//   return messages.every(
//     (message) => message.role && typeof message.content === "string" && message.content.trim() !== "",
//   );
// }

// /**
//  * Sends a message to the OpenAI API and returns the response
//  */
// export async function sendMessage(messages: ChatMessage[], model: string = defaultModel): Promise<string> {
//   try {
//     if (!validateMessages(messages)) {
//       throw new Error("Invalid message format: all messages must have role and content");
//     }

//     const response = await openai.chat.completions.create({
//       model,
//       messages,
//       temperature: 0.5,
//     });

//     return response.choices[0]?.message?.content || "";
//   } catch (error) {
//     console.error("Error sending message to AI service:", error);
//     throw new Error("Failed to get response from AI service");
//   }
// }

// /**
//  * Streaming API for compatibility with Vercel AI SDK
//  */
// export async function streamingChatCompletion(
//   messages: ChatMessage[],
//   model: string = defaultModel,
// ): Promise<OpenAI.Chat.Completions.ChatCompletion | AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
//   try {
//     if (!validateMessages(messages)) {
//       throw new Error("Invalid message format: all messages must have role and content");
//     }

//     return await openai.chat.completions.create({
//       model,
//       stream: true,
//       messages,
//       temperature: 0.5,
//     });
//   } catch (error) {
//     console.error("Error streaming response from AI service:", error);
//     throw new Error("Failed to stream response from AI service");
//   }
// }
