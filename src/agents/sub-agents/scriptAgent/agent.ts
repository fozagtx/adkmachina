import { env } from "node:process";
import { LlmAgent } from "@iqai/adk";
import { scriptWritingTool } from "./tools";

export const getScriptAgent = () => {
  const scriptAgent = new LlmAgent({
    name: "script_agent",
    description:
      "expands validated hooks into retention-optimized short-form video scripts",
    model: env.LLM_MODEL || "gpt-4o",
    tools: [scriptWritingTool],
  });

  return scriptAgent;
};
