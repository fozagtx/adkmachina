import { createTool } from "@iqai/adk";
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
    avatarType: z
      .string()
      .describe("Type of avatar: fitness, beauty, tech, lifestyle, etc"),
    tone: z
      .string()
      .describe("Voice tone: energetic, calm, professional, funny, dramatic"),
    topic: z.string().describe("Topic or hook for the voiceover"),
    duration: z.number().describe("Target duration in seconds (15-60)"),
  }),
  fn: async ({ avatarType, tone, topic, duration }) => {
    try {
      const script = generateScript(avatarType, tone, topic, duration);

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

      return JSON.stringify({
        success: true,
        script,
        scriptUrl: `/uploads/voiceovers/${scriptFilename}`,
        audioUrl: `/uploads/voiceovers/${audioFilename}`,
        estimatedDuration: duration,
        voiceType: tone,
        avatarType,
        suggestions: {
          hooks: generateHooks(topic),
          cta: generateCTA(avatarType),
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return `Error generating voiceover: ${errorMessage}`;
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

function generateScript(
  avatarType: string,
  tone: string,
  topic: string,
  duration: number,
): string {
  const hooks = generateHooks(topic);
  const cta = generateCTA(avatarType);

  return `${hooks[0]} ${topic} ${cta}`;
}

function generateHooks(topic: string): string[] {
  return [
    `Stop scrolling! You need to see this...`,
    `Wait, this changes everything about ${topic}...`,
    `Nobody talks about this...`,
    `I can't believe this actually works...`,
    `This is the secret everyone's asking about...`,
  ];
}

function generateCTA(avatarType: string): string {
  const ctas: Record<string, string> = {
    fitness: "Follow for more fitness tips!",
    beauty: "Follow for daily beauty hacks!",
    tech: "More tech tips coming!",
    lifestyle: "Follow for more life-changing content!",
    default: "Follow for more!",
  };

  return ctas[avatarType.toLowerCase()] || ctas.default;
}
