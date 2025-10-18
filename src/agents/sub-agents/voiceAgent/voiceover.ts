const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export type AvatarType =
  | "default"
  | "fitness"
  | "beauty"
  | "tech"
  | "lifestyle";

export type VoiceTone =
  | "energetic"
  | "calm"
  | "professional"
  | "funny"
  | "dramatic";

export const DEFAULT_AVATAR_TYPE: AvatarType = "default";
export const DEFAULT_VOICE_TONE: VoiceTone = "professional";

export interface VoiceoverRequest {
  script: string;
  avatarType?: AvatarType;
  tone?: VoiceTone;
}

export interface VoiceoverSuccessResult {
  success: true;
  script: string;
  audioUrl: string;
  voiceType: VoiceTone;
  avatarType: AvatarType;
}

export interface VoiceoverErrorResult {
  success: false;
  error: string;
}

export type VoiceoverResult = VoiceoverSuccessResult | VoiceoverErrorResult;

export function selectVoiceId(
  tone: VoiceTone = DEFAULT_VOICE_TONE,
  _avatarType: AvatarType = DEFAULT_AVATAR_TYPE,
): string {
  const voices: Record<VoiceTone, string> = {
    energetic: "pNInz6obpgDQGcFmaJgB", // Adam
    calm: "EXAVITQu4vr4xnSDxMaL", // Bella
    professional: "ErXwobaYiN019PkySvjV", // Antoni
    funny: "TxGEqnHWrfWFTfGW9XjX", // Josh
    dramatic: "VR6AewLTigWG4xSOukaG", // Arnold
  };

  const normalizedTone = tone.toLowerCase() as VoiceTone;
  return voices[normalizedTone] ?? voices.professional;
}

export async function requestVoiceoverAudio(
  params: VoiceoverRequest,
): Promise<VoiceoverResult> {
  const {
    script,
    avatarType = DEFAULT_AVATAR_TYPE,
    tone = DEFAULT_VOICE_TONE,
  } = params;
  const normalizedScript = script.trim();

  if (!normalizedScript) {
    return {
      success: false,
      error: "Script text is required to generate audio.",
    };
  }

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
      scriptLength: normalizedScript.length,
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
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: normalizedScript,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => `Failed to get error text, status: ${response.statusText}`);
      console.error(`ElevenLabs API returned status ${response.status}: ${errorText}`);
      return {
        success: false,
        error: `ElevenLabs API error (${response.status}): ${errorText}`,
      };
    }

    console.log("API response received, processing audio buffer...");
    const audioBuffer = await response.arrayBuffer();
    console.log("Audio buffer size:", audioBuffer.byteLength, "bytes");

    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
    console.log("Generated data URL for audio.");

    return {
      success: true,
      script: normalizedScript,
      audioUrl,
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
}
