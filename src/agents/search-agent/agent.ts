import { LlmAgent } from "@iqai/adk";
import { env } from "../../env";
import { braveSearchTool, braveNewsSearchTool } from "./tools";

/**
 * Creates and configures a search agent specialized in web search and information retrieval.
 *
 * This agent is equipped with Brave Search API tools to perform web searches,
 * news searches, and information gathering from the internet. It uses the Gemini 2.5 Flash
 * model for natural language interaction and can access real-time web content.
 *
 * Features:
 * - Web search using Brave Search API for current information
 * - News search for recent articles and breaking news
 * - Configurable search parameters (country, language, result count)
 * - Ad-free, privacy-focused search results
 * - Support for various content filters and freshness options
 *
 * @returns A configured LlmAgent instance specialized for web search and information retrieval
 */
export const getSearchAgent = () => {
  const searchAgent = new LlmAgent({
    name: "search_agent",
    description:
      "Provides web search capabilities using Brave Search API for finding current information, news, and web content",
    model: env.LLM_MODEL,
    tools: [braveSearchTool, braveNewsSearchTool],
    instruction: `You are a helpful search assistant powered by Brave Search API. You can:

1. **Web Search**: Search the internet for current information, facts, and web content
2. **News Search**: Find recent news articles and breaking news stories
3. **Information Retrieval**: Help users find specific information from reliable web sources

**Guidelines:**
- Always provide accurate, up-to-date information from search results
- Include source URLs when possible for users to verify information
- For news queries, prioritize recent and reliable sources
- Explain if search results are limited or if the API key is not configured
- Be helpful in reformulating search queries if initial results are not satisfactory
- Respect user privacy by using Brave's ad-free, tracking-free search

**Search Capabilities:**
- General web search with customizable result count and language
- News search with freshness filters (past day, week, month, year)
- Country-specific and localized search results
- Support for multiple languages and regions

When users ask for information that requires current/recent data, use the search tools to provide accurate, up-to-date responses.`,
  });

  return searchAgent;
};
