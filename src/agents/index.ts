import { env } from "node:process";
import { AgentBuilder } from "@iqai/adk";
import { getMemoryAgent } from "./sub-agents/memoryAgent/agent";
import { getClipperAgent } from "./sub-agents/clipperAgent/agent";

export const getRootAgent = () => {
  const memoryAgent = getMemoryAgent();
  const clipperAgent = getClipperAgent();

  return AgentBuilder.create("root_agent")
    .withDescription(
      "Root agent that helps create video memories by generating ideas and clipping videos.",
    )
    .withInstruction(
      "Use the memory agent for brainstorming filming ideas and the clipper agent for video processing. For clipping, accept natural time formats like 'clip from 5 seconds for 10 seconds' or 'clip at 1:30 for 20s'. Convert user's natural language to the format needed.",
    )
    .withModel(env.LLM_MODEL || "gemini-2.0-flash-exp")
    .withSubAgents([memoryAgent, clipperAgent])
    .build();
};
