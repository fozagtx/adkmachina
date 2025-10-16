import { createTool, type Agent } from "@iqai/adk";
import { z } from "zod";
import { ElevenLabsClient } from "elevenlabs";
import path from "node:path";
import fs from "node:fs/promises";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

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
      const voiceId = selectVoiceId(tone, avatarType);

      const audio = await client.textToSpeech.convert(voiceId, {
        text: script,
        model_id: "eleven_turbo_v2_5",
      });

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

      const chunks: Buffer[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }
      await fs.writeFile(audioPath, Buffer.concat(chunks));
      await fs.writeFile(scriptPath, script);

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
