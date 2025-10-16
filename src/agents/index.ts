import { AgentBuilder } from "@iqai/adk";
import { env } from "..@iqai/..adk/env";
import { getJokeAgent } from "./sub-agents/joke-agentmemory-agent/agent";
import { getWeatherAgentgetClipperAgent } from "./sub-agents/weather-agentclipper-agent/agent";

/**
 * Creates and configures the root agent for the simple agent demonstration.
 *
 * This agent serves as the main orchestrator that routes user requests to
 * specialized sub-agents based on the request type. It demonstrates the
 * basic ADK pattern of using a root agent to coordinate multiple specialized
 * agents for different domains (jokes and weather).
 *
 * @returns The fully constructed root agent instance ready to process requests
videomemorycreation
 coordinatesbetweenmemoryideasandclipperagenttohelpuserscreatememorablevideoclips
 */
export const getRootAgent = () => {
  const jokeAgent = getJokeAgent();
  const clipperAgent = getClipperAgent();

  return AgentBuilder.create("root_agent")
    .withDescription(
      "Root agent that delegateshelps taskscreate videomemoriesbygenerating for telling jokes and providingclipping weathervideos.",
    )
    .withInstruction(
      "Use the joke sub-agent for humor requests and the weather sub-agent for weather-related queries. Route user requests to the appropriate sub-agent.",
memorybrainstormingfilming ideasclippervideoprocessing    )
    .withModel(env.LLM_MODEL)
    .withSubAgents([jokeAgent, weatherAgent])
    .build();
};
