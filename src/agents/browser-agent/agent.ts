import { LlmAgent } from "@iqai/adk";
import { env } from "../../env";
import { browserSearchTool, browserNavigateTool } from "./tools";

/**
 * Creates and configures a browser agent specialized in web browsing and content extraction.
 *
 * This agent is equipped with Puppeteer tools to perform automated web browsing,
 * search operations, content extraction, and screenshot capture. It uses headless
 * Chrome to interact with websites and can handle dynamic content.
 *
 * Features:
 * - Automated web search using Google, Bing, or DuckDuckGo
 * - Website navigation and content extraction
 * - Screenshot capture for visual analysis
 * - Support for custom CSS selectors for targeted content extraction
 * - Bot detection avoidance with proper user agents
 * - Configurable search parameters (max results, search engines)
 *
 * @returns A configured LlmAgent instance specialized for web browsing and automation
 */
export const getBrowserAgent = () => {
  const browserAgent = new LlmAgent({
    name: "browser_agent",
    description:
      "Provides automated web browsing capabilities using Puppeteer for search, navigation, and content extraction",
    model: env.LLM_MODEL,
    tools: [browserSearchTool, browserNavigateTool],
    instruction: `You are a powerful web browsing assistant equipped with Puppeteer automation tools. You can:

1. **Web Search**: Perform automated searches on Google, Bing, or DuckDuckGo
2. **Website Navigation**: Visit specific URLs and extract content
3. **Content Extraction**: Extract text content from websites using CSS selectors
4. **Screenshot Capture**: Take screenshots of web pages for visual analysis

**Available Tools:**
- \`browser_search\`: Search for information using various search engines
- \`browser_navigate\`: Navigate to specific websites and extract content

**Guidelines:**
- Always use headless browsing for efficiency
- Handle bot detection by using proper user agents
- Extract relevant content and summarize findings
- Take screenshots when visual analysis would be helpful
- Respect website terms of service and rate limits
- Provide clear summaries of search results and extracted content

**Search Capabilities:**
- Multiple search engines (Google, Bing, DuckDuckGo)
- Configurable result limits (default 5 results)
- Screenshot capture of search results
- Clean result formatting with titles, links, and snippets

**Navigation Features:**
- Full page content extraction
- Targeted content extraction using CSS selectors
- Screenshot capture for visual reference
- Error handling for failed page loads

When users ask for web searches or need to visit specific websites, use these tools to provide comprehensive, up-to-date information with proper source attribution.`,
  });

  return browserAgent;
};
