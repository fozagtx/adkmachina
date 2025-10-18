import { createTool } from "@iqai/adk";
import { z } from "@iqai/adk/node_modules/zod";
import { requestVoiceoverAudio } from "./voiceover";

const voiceGenerationSchema = z.object({
  script: z
    .string()
    .min(1, "Script text is required to generate audio.")
    .describe("The final script text that should be transformed into a voice-over."),
  avatarType: z
    .enum(["default", "fitness", "beauty", "tech", "lifestyle"])
    .default("default")
    .describe("Avatar persona or category the voice should align with."),
  tone: z
    .enum(["energetic", "calm", "professional", "funny", "dramatic"])
    .default("professional")
    .describe("Desired voice tone for the generated audio."),
});

type VoiceGenerationInput = z.infer<typeof voiceGenerationSchema>;

export const voiceTool = createTool<VoiceGenerationInput>({
  name: "generate_voiceover",
  description:
    "Generate viral voiceover script and audio for UGC avatars using ElevenLabs",
  schema: voiceGenerationSchema,
  fn: async ({ script, avatarType, tone }: VoiceGenerationInput) => {
    return requestVoiceoverAudio({
      script,
      avatarType,
      tone,
    });
  },
});
