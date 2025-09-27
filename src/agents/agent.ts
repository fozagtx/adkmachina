import { AgentBuilder } from "@iqai/adk";
import { env } from "../env";
import { getDatasetAgent } from "./DatasetAgent/agent";
import { getSearchAgent } from "./search-agent/agent";

export const getRootAgent = () => {
  const searchAgent = getSearchAgent();
  const datasetAgent = getDatasetAgent();

  return AgentBuilder.create("root_agent")
    .withDescription(
      "Root agent for web search, browser automation, and dataset generation",
    )
    .withInstruction(
      "Route requests to the appropriate agent: Search Agent for API-based web search, Browser Agent for automated web browsing and screenshots, or Dataset Agent for synthetic data generation",
    )
    .withModel(env.LLM_MODEL)
    .withSubAgents([searchAgent, datasetAgent])
    .build();
};
