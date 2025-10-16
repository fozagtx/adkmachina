import { env } from "node:process";
import { LlmAgent } from "@iqai/adk";

import { memoryTool } from "./tools";

/**
 * Creates and configures a memory ideas agent.
 *
 * This agent helps users brainstorm what moments to capture in their videos.
 * It provides creative suggestions based on occasion type, location, and theme.
 *
 * @returns A configured LlmAgent instance specialized for memory ideas
 */
export const getMemoryAgent = () => {
  const memoryAgent = new LlmAgent({
    name: "memory_agent",
    description: "provides creative memory moment ideas for capturing videos",
    model: env.LLM_MODEL || "gemini-2.0-flash-exp",
    tools: [memoryTool],
  });

  return memoryAgent;
};
