import { LlmAgent } from "@iqai/adk";
import { env } from "@iqai/adk/env";
import { clipTool } from "./tools";

/**
 * Creates and configures a video clipper agent.
 *
 * This agent processes video files and creates clips based on user specifications.
 * It handles video analysis and clipping operations.
 *
 * @returns A configured LlmAgent instance specialized for video clipping
 */
export const getClipperAgent = () => {
  const clipperAgent = new LlmAgent({
    name: "clipper_agent",
    description: "processes videos and creates clips from uploaded content",
    model: env.LLM_MODEL,
    tools: [clipTool],
  });

  return clipperAgent;
};
