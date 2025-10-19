import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return new Response("Missing text", { status: 400 });
  }

  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`ElevenLabs API error: ${errorText}`, {
        status: response.status,
      });
    }

    const audioBlob = await response.blob();
    return new NextResponse(audioBlob, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    return new Response("Failed to generate voice over", { status: 500 });
  }
}
