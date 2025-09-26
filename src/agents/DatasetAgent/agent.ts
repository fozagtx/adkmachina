import { LlmAgent } from "@iqai/adk";
import { env } from "../../env";
import {
  generateTabularDatasetTool,
  generateTextDatasetTool,
  getSynthikInfoTool,
} from "./tools";

export const getDatasetAgent = () => {
  const datasetAgent = new LlmAgent({
    name: "dataset_agent",
    description: "Generates synthetic datasets using Synthik API",
    model: env.LLM_MODEL,
    tools: [
      generateTabularDatasetTool,
      generateTextDatasetTool,
      getSynthikInfoTool,
    ],
    instruction:
      "You generate synthetic datasets for machine learning and testing. Use tabular tools for structured data and text tools for NLP datasets.",
  });

  return datasetAgent;
};
