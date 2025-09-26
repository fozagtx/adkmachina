import { createTool } from "@iqai/adk";
import * as z from "zod";
import { env } from "../../env";

/**
 * Tool for performing web searches using the Brave Search API.
 */
export const braveSearchTool = createTool({
  name: "brave_search",
  description: "Search the web using Brave Search API for current information",
  schema: z.object({
    query: z.string().describe("Search query"),
    count: z.number().min(1).max(20).default(10).describe("Number of results"),
  }),
  fn: async ({ query, count }) => {
    if (!env.BRAVE_API_KEY) {
      return {
        error:
          "Brave Search API key not configured. Please set BRAVE_API_KEY environment variable.",
        suggestion:
          "Get your API key from https://api-dashboard.search.brave.com/",
      };
    }

    try {
      const searchParams = new URLSearchParams({
        q: query,
        count: count.toString(),
      });

      const response = await fetch(
        `https://api.search.brave.com/res/v1/web/search?${searchParams}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-Subscription-Token": env.BRAVE_API_KEY,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Brave Search API error: ${response.status}`);
      }

      const data = (await response.json()) as any;

      return {
        query,
        total_results: data.web?.results?.length || 0,
        results:
          data.web?.results?.map((result: any) => ({
            title: result.title,
            url: result.url,
            description: result.description,
          })) || [],
      };
    } catch (error) {
      return {
        error: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        query,
        suggestion:
          "Try a different search query or check your internet connection.",
      };
    }
  },
});

/**
 * Tool for searching news using Brave Search API.
 */
export const braveNewsSearchTool = createTool({
  name: "brave_news_search",
  description: "Search for recent news articles using Brave Search",
  schema: z.object({
    query: z.string().describe("News search query"),
    count: z.number().min(1).max(20).default(10).describe("Number of articles"),
  }),
  fn: async ({ query, count }) => {
    if (!env.BRAVE_API_KEY) {
      return {
        error:
          "Brave Search API key not configured. Please set BRAVE_API_KEY environment variable.",
        suggestion:
          "Get your API key from https://api-dashboard.search.brave.com/",
      };
    }

    try {
      const searchParams = new URLSearchParams({
        q: query,
        count: count.toString(),
      });

      const response = await fetch(
        `https://api.search.brave.com/res/v1/news/search?${searchParams}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-Subscription-Token": env.BRAVE_API_KEY,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Brave News API error: ${response.status}`);
      }

      const data = (await response.json()) as any;

      return {
        query,
        total_results: data.results?.length || 0,
        articles:
          data.results?.map((article: any) => ({
            title: article.title,
            url: article.url,
            description: article.description,
            published_date: article.age,
          })) || [],
      };
    } catch (error) {
      return {
        error: `News search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        query,
        suggestion:
          "Try a different news query or check your internet connection.",
      };
    }
  },
});
