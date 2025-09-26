import { AgentBuilder } from "@iqai/adk";
import { env } from "../env";
import { getDatasetAgent } from "./DatasetAgent/agent";
import { getSearchAgent } from "./search-agent/agent";

export const getRootAgent = () => {
  const searchAgent = getSearchAgent();
  const datasetAgent = getDatasetAgent();

  return AgentBuilder.create("root_agent")
    .withDescription("Root agent for web search and dataset generation")
    .withInstruction(
      "Route requests to Search Agent for web info or Dataset Agent for data generation",
    )
    .withModel(env.LLM_MODEL)
    .withSubAgents([searchAgent, datasetAgent])
    .build();
};
