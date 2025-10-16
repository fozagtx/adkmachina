import { env } from "node:process";
import { LlmAgent } from "@iqai/adk";
import { scriptIdeationTool } from "./tools";

export const getScriptAgent = () => {
  const scriptAgent = new LlmAgent({
    name: "script_agent",
    description: "generates viral script ideas and hooks for UGC content",
    model: env.LLM_MODEL || "gemini-2.0-flash-exp",
    tools: [scriptIdeationTool],
  });

  return scriptAgent;
};
