"use server";

import { getRootAgent } from "@/agents";
import {
  requestVoiceoverAudio,
  type AvatarType,
  type VoiceTone,
} from "@/agents/sub-agents/voiceAgent/voiceover";

export interface AgentResponse {
  success: boolean;
  content: string;
  error?: string;
}

export interface AudioAgentResponse extends AgentResponse {
  script: string;
  audioUrl: string;
  voiceType: string;
  avatarType: string;
}

export interface GenerateVoiceoverParams {
  script: string;
  avatarType?: AvatarType;
  tone?: VoiceTone;
}

export async function askAgent(
  message: string,
  avatarType?: string,
  tone?: string,
): Promise<AgentResponse | AudioAgentResponse> {
  const { runner } = await getRootAgent();

  try {
    const formattedMessage =
      tone && avatarType
        ? `${message}\n\nConfig:\navatarType: ${avatarType}\ntone: ${tone}`
        : message;

    const result = await runner.ask(formattedMessage);

    // Type guard to check if result is an audio response
    const isAudioResponse = (
      obj: any,
    ): obj is {
      success: boolean;
      script: string;
      audioUrl: string;
      voiceType: string;
      avatarType: string;
    } => {
      return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.script === "string" &&
        typeof obj.audioUrl === "string" &&
        typeof obj.voiceType === "string" &&
        typeof obj.avatarType === "string"
      );
    };

    const parseAudioResponse = (
      payload: unknown,
    ): {
      success: boolean;
      script: string;
      audioUrl: string;
      voiceType: string;
      avatarType: string;
    } | null => {
      if (isAudioResponse(payload)) {
        return payload;
      }

      if (typeof payload !== "string") {
        return null;
      }

      const trimmed = payload.trim();
      const jsonBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
      const jsonCandidate = jsonBlockMatch
        ? jsonBlockMatch[1].trim()
        : trimmed.startsWith("{")
        ? trimmed
        : null;

      if (!jsonCandidate) {
        return null;
      }

      try {
        const parsed = JSON.parse(jsonCandidate);
        return isAudioResponse(parsed) ? parsed : null;
      } catch (parseError) {
        console.warn("Failed to parse agent audio response:", parseError);
        return null;
      }
    };

    const audioResult = parseAudioResponse(result);

    if (audioResult) {
      return {
        success: true,
        content: audioResult.script,
        script: audioResult.script,
        audioUrl: audioResult.audioUrl,
        voiceType: audioResult.voiceType,
        avatarType: audioResult.avatarType,
      };
    }

    return {
      success: true,
      content: String(result),
    };
  } catch (error) {
    return {
      success: false,
      content: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function generateVoiceover({
  script,
  avatarType,
  tone,
}: GenerateVoiceoverParams): Promise<AgentResponse | AudioAgentResponse> {
  const result = await requestVoiceoverAudio({
    script,
    avatarType,
    tone,
  });

  if (result.success) {
    return {
      success: true,
      content: result.script,
      script: result.script,
      audioUrl: result.audioUrl,
      voiceType: result.voiceType,
      avatarType: result.avatarType,
    };
  }

  const errorMessage =
    result.error || "Unable to generate voiceover. Please try again.";

  return {
    success: false,
    content: "",
    error: errorMessage,
  };
}
