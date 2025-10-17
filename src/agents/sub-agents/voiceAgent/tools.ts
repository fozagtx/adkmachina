import { createTool } from "@iqai/adk";
import { z } from "@iqai/adk/node_modules/zod";

const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

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
    const normalizedAvatarType = avatarType ?? "default";
    const normalizedTone = tone ?? "professional";

    if (!ELEVENLABS_API_KEY) {
      const missingKeyMessage =
        "Missing ELEVENLABS_API_KEY environment variable. Audio generation requires a valid ElevenLabs API key.";
      console.error(missingKeyMessage);
      return {
        success: false,
        error: missingKeyMessage,
      };
    }

    try {
      console.log("Generating voiceover with params:", {
        script,
        avatarType: normalizedAvatarType,
        tone: normalizedTone,
      });
      const voiceId = selectVoiceId(normalizedTone, normalizedAvatarType);
      console.log("Selected voice ID:", voiceId);

      const response = await fetch(
        `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
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
        const errorText = await response.text().catch(
          () => response.statusText,
        );
        console.error("ElevenLabs API error:", errorText);
        throw new Error(`ElevenLabs API error: ${errorText}`);
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
        audioUrl,
        voiceType: normalizedTone,
        avatarType: normalizedAvatarType,
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
    default: "ErXwobaYiN019PkySvjV", // Default to professional voice
  };

  const normalizedTone = tone.toLowerCase();

  return voices[normalizedTone] || voices.professional;
}
