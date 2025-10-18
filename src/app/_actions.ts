"use server";

import { getRootAgent } from "@/agents";

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

    if (isAudioResponse(result)) {
      return {
        success: true,
        content: result.script,
        script: result.script,
        audioUrl: result.audioUrl,
        voiceType: result.voiceType,
        avatarType: result.avatarType,
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
