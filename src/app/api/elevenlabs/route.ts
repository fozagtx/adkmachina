import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");
    const voiceId = searchParams.get("voiceId");

    if (!text || !voiceId) {
      return new NextResponse("Missing text or voiceId", { status: 400 });
    }

    if (!ELEVENLABS_API_KEY) {
      return new NextResponse("Missing ELEVENLABS_API_KEY", { status: 500 });
    }

    const response = await fetch(
      `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => `Failed to get error text, status: ${response.statusText}`);
      console.error(
        `ElevenLabs API returned status ${response.status}: ${errorText}`,
      );
      return new NextResponse(
        `ElevenLabs API error (${response.status}): ${errorText}`,
        { status: response.status },
      );
    }

    if (response.body) {
      const readableStream = new ReadableStream({
        start(controller) {
          const reader = response.body!.getReader();
          function push() {
            reader
              .read()
              .then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                push();
              })
              .catch((err) => {
                console.error("Error reading from stream:", err);
                controller.error(err);
              });
          }
          push();
        },
      });

      return new NextResponse(readableStream, {
        headers: {
          "Content-Type": "audio/mpeg",
        },
      });
    }
    return new NextResponse("No response body", { status: 500 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Voice generation error:", errorMessage);
    return new NextResponse(`Error generating voiceover: ${errorMessage}`, {
      status: 500,
    });
  }
}
