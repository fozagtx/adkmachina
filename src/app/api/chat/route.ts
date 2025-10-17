import { askAgent } from "@/app/_actions";
import { NextRequest, NextResponse } from "next/server";
import { Message, StreamingTextResponse } from "ai";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];
  const { content } = lastMessage;

  const response = await askAgent(content);

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 500 });
  }

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(response.content);
      controller.close();
    },
  });

  return new StreamingTextResponse(stream);
}