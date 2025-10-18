import { env } from "node:process";
import { LlmAgent } from "@iqai/adk";
import { hookGenerationTool } from "./tools";

export const getHookAgent = () => {
  const hookAgent = new LlmAgent({
    name: "hook_agent",
    description:
      "creates scroll-stopping hooks and pattern interrupts for viral short-form content",
    model: env.LLM_MODEL || "gemini-2.0-flash-exp",
    tools: [hookGenerationTool],
  });

  return hookAgent;
};
