import { createTool } from "@iqai/adk";
import * as z from "zod";
import SynthikClient, {
  ColumnBuilder,
  type DatasetGenerationRequest,
  type TextDatasetGenerationRequest,
} from "synthik-client";

/**
 * Tool for generating synthetic tabular datasets using Synthik API.
 */
export const generateTabularDatasetTool = createTool({
  name: "generate_tabular_dataset",
  description:
    "Generate synthetic tabular datasets with custom columns using Synthik API",
  schema: z.object({
    topic: z
      .string()
      .describe("Topic for the dataset (e.g., 'user profiles', 'sales data')"),
    num_rows: z
      .number()
      .min(1)
      .max(1000)
      .default(50)
      .describe("Number of rows to generate"),
    columns: z
      .array(
        z.object({
          name: z.string(),
          type: z.enum(["string", "int", "email", "categorical"]),
          description: z.string().optional(),
          categories: z.array(z.string()).optional(),
        }),
      )
      .describe("Column definitions"),
  }),
  fn: async ({ topic, num_rows, columns }) => {
    try {
      const client = new SynthikClient();

      const builtColumns = columns.map((col) => {
        switch (col.type) {
          case "string":
            return ColumnBuilder.string(col.name, {
              description: col.description,
            }).build();
          case "int":
            return ColumnBuilder.int(col.name, {
              description: col.description,
            }).build();
          case "email":
            return ColumnBuilder.email().build();
          case "categorical":
            if (!col.categories)
              throw new Error(
                `Categorical column '${col.name}' needs categories`,
              );
            return ColumnBuilder.categorical(col.name, col.categories).build();
          default:
            throw new Error(`Unsupported column type: ${col.type}`);
        }
      });

      const request: DatasetGenerationRequest = {
        num_rows,
        topic,
        columns: builtColumns,
      };

      const result = await client.tabular.generate(request, {
        strategy: "adaptive_flow",
        format: "json",
      });

      return {
        success: true,
        topic,
        num_rows,
        columns_defined: columns.length,
        data: result,
      };
    } catch (error) {
      return {
        error: `Dataset generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        suggestion: "Check your column definitions",
      };
    }
  },
});

/**
 * Tool for generating synthetic text datasets using Synthik API.
 */
export const generateTextDatasetTool = createTool({
  name: "generate_text_dataset",
  description:
    "Generate synthetic text datasets for AI training using Synthik API",
  schema: z.object({
    task_definition: z
      .string()
      .describe("AI task definition (e.g., 'sentiment analysis')"),
    data_domain: z
      .string()
      .describe("Data domain (e.g., 'e-commerce reviews')"),
    data_description: z
      .string()
      .describe("Description of expected data format"),
    num_samples: z
      .number()
      .min(1)
      .max(100)
      .default(10)
      .describe("Number of samples to generate"),
  }),
  fn: async ({
    task_definition,
    data_domain,
    data_description,
    num_samples,
  }) => {
    try {
      const client = new SynthikClient();

      const request: TextDatasetGenerationRequest = {
        num_samples,
        task_definition,
        data_domain,
        data_description,
        output_format: "instruction",
        sample_examples: [],
      };

      const result = await client.text.generate(request);

      return {
        success: true,
        task_definition,
        data_domain,
        num_samples,
        data: result,
      };
    } catch (error) {
      return {
        error: `Text dataset generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        suggestion: "Check your task definition",
      };
    }
  },
});

/**
 * Tool for getting Synthik API information.
 */
export const getSynthikInfoTool = createTool({
  name: "get_synthik_info",
  description: "Get information about Synthik API capabilities",
  schema: z.object({
    info_type: z
      .enum(["formats", "limits"])
      .describe("Type of information to get"),
  }),
  fn: async ({ info_type }) => {
    switch (info_type) {
      case "formats":
        return {
          success: true,
          data: {
            tabular_formats: ["json", "csv", "parquet"],
            text_formats: ["instruction"],
            column_types: ["string", "int", "email", "categorical"],
          },
        };
      case "limits":
        return {
          success: true,
          data: {
            tabular: { max_rows: 1000, max_columns: 50 },
            text: { max_samples: 100 },
          },
        };
      default:
        return { error: "Unknown info type" };
    }
  },
});
