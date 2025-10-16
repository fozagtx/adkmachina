import { createTool, type Agent } from "@iqai/adk";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs/promises";

const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export const voiceTool = createTool({
  name: "generate_voiceover",
  description:
    "Generate viral voiceover script and audio for UGC avatars using ElevenLabs",
  schema: z.object({
    script: z.string().describe("The script for the voiceover"),
    avatarType: z
      .string()
      .describe("Type of avatar: fitness, beauty, tech, lifestyle, etc"),
    tone: z
      .string()
      .describe("Voice tone: energetic, calm, professional, funny, dramatic"),
  }),
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
      const timestamp = Date.now();
      const audioFilename = `voiceover_${timestamp}.mp3`;
      const scriptFilename = `script_${timestamp}.txt`;

      const audioPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "voiceovers",
        audioFilename,
      );
      const scriptPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "voiceovers",
        scriptFilename,
      );

      await fs.mkdir(path.dirname(audioPath), { recursive: true });

      await fs.writeFile(audioPath, Buffer.from(audioBuffer));
      await fs.writeFile(scriptPath, script);

      console.log("Files written successfully:", {
        audioPath,
        scriptPath,
        audioSize: audioBuffer.byteLength,
      });

      return {
        success: true,
        script,
        scriptUrl: `/uploads/voiceovers/${scriptFilename}`,
        audioUrl: `/uploads/voiceovers/${audioFilename}`,
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
