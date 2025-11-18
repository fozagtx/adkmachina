import { config } from "dotenv";
import { z } from "zod";

config();

/**
 * Environment variable schema definition for the simple agent.
 *
 * Defines and validates required environment variables including:
 * - DEBUG: Optional debug mode flag (defaults to "false")
 * - OPENAI_API_KEY: Required API key for OpenAI model access
 */
export const envSchema = z.object({
  ADK_DEBUG: z.coerce.boolean().default(false),
  OPENAI_API_KEY: z.string(),
  ELEVENLABS_API_KEY: z.string(),
  LLM_MODEL: z.string().default("gpt-4o"),
});

/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
export const env = envSchema.parse(process.env);
