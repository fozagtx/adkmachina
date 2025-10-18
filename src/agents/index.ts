import { env } from "node:process";
import { AgentBuilder } from "@iqai/adk";
import { getHookAgent } from "./sub-agents/hookAgent/agent";
import { getScriptAgent } from "./sub-agents/scriptAgent/agent";
import { getVoiceAgent } from "./sub-agents/voiceAgent/agent";

export const getRootAgent = () => {
  const hookAgent = getHookAgent();
  const scriptAgent = getScriptAgent();
  const voiceAgent = getVoiceAgent();

  return AgentBuilder.create("root_agent")
    .withDescription(
      "Root agent orchestrating specialists for hook ideation, script development, and voiceover production to create viral-ready UGC.",
    )
    .withInstruction(
      "Start by calling the hook agent to craft scroll-stopping openings and pattern interrupts. Once a direction is chosen, collaborate with the script agent to expand the hook into a structured, retention-optimized script. When the script is finalized, engage the voice agent to generate audio in the requested tone. Support avatar types (fitness, beauty, tech, lifestyle) and deliver 15-60 second content with clear CTAs.",
    )
    .withModel(env.LLM_MODEL || "gemini-2.0-flash-exp")
    .withSubAgents([hookAgent, scriptAgent, voiceAgent])
    .build();
};
