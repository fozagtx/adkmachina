import { env } from "node:process";
import { LlmAgent } from "@iqai/adk";
import { memoryTool } from "./tools";

export const getMemoryAgent = () => {
  const memoryAgent = new LlmAgent({
    name: "memory_agent",
    description: "provides creative memory moment ideas for capturing videos",
    model: env.LLM_MODEL,
    tools: [memoryTool],
  });

  return memoryAgent;
};
