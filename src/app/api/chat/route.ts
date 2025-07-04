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
