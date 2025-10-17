import { createTool, type Agent } from "@iqai/adk";
import { z } from "zod";

const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export const voiceTool = createTool({
  name: "generate_voiceover",
  description:
    "Generate viral voiceover script and audio for UGC avatars using ElevenLabs",
  fn: async ({ script, avatarType, tone }) => {
    try {
      console.log("Generating voiceover with params:", {
        script,
        avatarType,
        tone,
      });
      const voiceId = selectVoiceId(tone, avatarType);
      console.log("Selected voice ID:", voiceId);

      const response = await fetch(
        `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY || "",
          },
          body: JSON.stringify({
            text: script,
            model_id: "eleven_turbo_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        },
      );

      if (!response.ok) {
        console.error("ElevenLabs API error:", response.statusText);
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      console.log("API response received, processing audio buffer...");
      const audioBuffer = await response.arrayBuffer();
      console.log("Audio buffer size:", audioBuffer.byteLength, "bytes");

      const base64Audio = Buffer.from(audioBuffer).toString("base64");
      const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

      console.log("Generated data URL for audio.");

      return {
        success: true,
        script,
        audioUrl: audioUrl,
        voiceType: tone,
        avatarType,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Voice generation error:", errorMessage);
      return {
        success: false,
        error: `Error generating voiceover: ${errorMessage}`,
      };
    }
  },
});

function selectVoiceId(tone: string, avatarType: string): string {
  const voices: Record<string, string> = {
    energetic: "pNInz6obpgDQGcFmaJgB", // Adam
    calm: "EXAVITQu4vr4xnSDxMaL", // Bella
    professional: "ErXwobaYiN019PkySvjV", // Antoni
    funny: "TxGEqnHWrfWFTfGW9XjX", // Josh
    dramatic: "VR6AewLTigWG4xSOukaG", // Arnold
  };

  return voices[tone.toLowerCase()] || voices.professional;
}
