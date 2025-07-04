export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = await req.json();
    console.log("API messages", messages);
    return new Response(JSON.stringify({ message: "Hello, world!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Failed to generate a response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
/*
import { streamingChatCompletion } from "@cms-ai/chat-service";
import { ChatMessage, systemPrompt } from "@cms-ai/chat-service-types";
import OpenAI from "openai";

// For edge runtime compatibility
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = await req.json();
    console.log("API messages", messages);
    // Validate incoming messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ensure all messages have required fields
    const validMessages = messages.map((msg) => ({
      role: msg.role || "user",
      content: typeof msg.content === "string" ? msg.content : "",
    }));

    // Ensure we have a system message
    const fullMessages: ChatMessage[] =
      validMessages[0]?.role === "system"
        ? validMessages
        : [{ role: "system", content: systemPrompt }, ...validMessages];

    // Use the streamingChatCompletion from chat-service
    const stream = (await streamingChatCompletion(
      fullMessages,
    )) as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;

    // Create a standard text response
    const textEncoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Process the OpenAI response
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              // Format as text stream chunk (expected by ai/react in text mode)
              controller.enqueue(textEncoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Error processing stream:", error);
          controller.error(error);
        }
      },
    });

    // Return a streaming response
    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Failed to generate a response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

*/
