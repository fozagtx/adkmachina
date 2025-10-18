import { env } from "node:process";
import { LlmAgent } from "@iqai/adk";
import { scriptWritingTool } from "./tools";

export const getScriptAgent = () => {
  const scriptAgent = new LlmAgent({
    name: "script_agent",
    description:
      "expands validated hooks into retention-optimized short-form video scripts",
    model: env.LLM_MODEL || "gemini-2.0-flash-exp",
    tools: [scriptWritingTool],
  });

  return scriptAgent;
};
