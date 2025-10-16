import { getRootAgent } from "@/agents";
import type { UIMessage } from "ai";
import { streamText } from "ai";

export const maxDuration = 30;

/**
 * API route for streaming chat with the ADK root agent.
 *
 * This endpoint integrates the ADK agent system with the AI SDK's chat UI,
 * enabling streaming responses with the professional chat interface components.
 */
export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Get the root agent instance
    const { runner } = await getRootAgent();

    // Extract the last user message
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "No message provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get response from ADK agent
    const result = await runner.ask(userMessage);

    // Create a proper AI SDK stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        try {
          // Send the complete text as a single message
          // Using AI SDK v1 protocol format
          const textChunk = `0:"${result.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"\n`;
          controller.enqueue(encoder.encode(textChunk));

          // Close the stream
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
  } catch (error) {
    console.error("Error in agent chat:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
