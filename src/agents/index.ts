import { env } from "node:process";
import { AgentBuilder } from "@iqai/adk";
import { getMemoryAgent } from "./sub-agents/memoryAgent/agent";
import { getClipperAgent } from "./sub-agents/clipperAgent/agent";

/**
 * Creates and configures the root agent for the video memory platform.
 *
 * This agent serves as the main orchestrator that coordinates between
 * memory ideas generation and video clipping operations to help users
 * create memorable video clips.
 *
 * @returns The fully constructed root agent instance ready to process requests
 */
export const getRootAgent = () => {
  const memoryAgent = getMemoryAgent();
  const clipperAgent = getClipperAgent();

  return AgentBuilder.create("root_agent")
    .withDescription(
      "Root agent that helps create video memories by generating ideas and clipping videos.",
    )
    .withInstruction(
      "Use the memory agent for brainstorming filming ideas and the clipper agent for video processing. Route user requests to the appropriate sub-agent.",
    )
    .withModel(env.LLM_MODEL || "gemini-2.0-flash-exp")
    .withSubAgents([memoryAgent, clipperAgent])
    .build();
};
