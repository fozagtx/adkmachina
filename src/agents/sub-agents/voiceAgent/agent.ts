import { env } from "node:process";
import { LlmAgent } from "@iqai/adk";
import { voiceTool } from "./tools";

export const getVoiceAgent = () => {
  const voiceAgent = new LlmAgent({
    name: "voice_agent",
    description: "generates viral voiceovers for UGC avatars with script writing and voice synthesis",
    model: env.LLM_MODEL || "gemini-2.0-flash-exp",
    tools: [voiceTool],
  });

  return voiceAgent;
};
