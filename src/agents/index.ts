import { env } from "node:process";
import { AgentBuilder } from "@iqai/adk";
import { getVoiceAgent } from "./sub-agents/voiceAgent/agent";
import { getScriptAgent } from "./sub-agents/scriptAgent/agent";

export const getRootAgent = () => {
  const voiceAgent = getVoiceAgent();
  const scriptAgent = getScriptAgent();

  return AgentBuilder.create("root_agent")
    .withDescription(
      "Root agent that helps create viral UGC content with script ideation and voiceovers for avatars.",
    )
    .withInstruction(
      "Use the script agent for generating viral script ideas, hooks, and content structure. Use the voice agent for generating voiceover audio with different tones. Support different avatar types (fitness, beauty, tech, lifestyle) and help users create engaging 15-60 second viral content.",
    )
    .withModel(env.LLM_MODEL || "gemini-2.0-flash-exp")
    .withSubAgents([scriptAgent, voiceAgent])
    .build();
};
