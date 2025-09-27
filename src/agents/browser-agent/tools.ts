import { createTool } from "@iqai/adk";
import puppeteer, { Browser, Page } from "puppeteer";
import * as z from "zod";

/**
 * Utility: Launch browser with Brave → Chrome → bundled Chromium
 */
async function launchBrowser(): Promise<Browser> {
  try {
    return await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/brave-browser",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: null,
    });
  } catch {
    try {
      return await puppeteer.launch({
        headless: true,
        executablePath: "/usr/bin/google-chrome",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: null,
      });
    } catch {
      return await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: null,
      });
    }
  }
}

export const browserSearchTool = createTool({
  name: "browser_search",
  description: "Open Chrome or Brave and search Google for information",
  schema: z.object({
    query: z.string().describe("The search query to look for"),
    maxResults: z
      .number()
      .optional()
      .default(5)
      .describe("Maximum number of results to return"),
    takeScreenshot: z
      .boolean()
      .optional()
      .default(false)
      .describe("Whether to take a screenshot of the results"),
  }),
  fn: async ({ query, maxResults, takeScreenshot }) => {
    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
      console.log(`🌐 Opening browser to search: "${query}"`);
      browser = await launchBrowser();

      page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720 });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      );

      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        query,
      )}`;
      await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 15000 });
      await page.waitForSelector(".g", { timeout: 10000 });

      const results = await page.evaluate((limit: number) => {
        const elements = (document as any).querySelectorAll(".g");
        const output: Array<{ title: string; link: string; snippet: string }> =
          [];

        for (let i = 0; i < Math.min(elements.length, limit); i++) {
          const el = elements[i];
          const title =
            el.querySelector("h3")?.textContent?.trim() || "No title";
          const link =
            (el.querySelector("a[href]") as HTMLAnchorElement)?.href ||
            "No link";
          const snippet =
            el.querySelector(".VwiC3b")?.textContent?.trim() ||
            "No snippet available";
          if (title && link) output.push({ title, link, snippet });
        }

        return output;
      }, maxResults);

      let screenshot: string | null = null;
      if (takeScreenshot) {
        screenshot = await page.screenshot({
          type: "png",
          fullPage: false,
          encoding: "base64",
        });
      }

      return {
        success: true,
        query,
        results,
        screenshot: screenshot ? `data:image/png;base64,${screenshot}` : null,
        message: `✅ Found ${results.length} results for "${query}"`,
      };
    } catch (error) {
      console.error("❌ Browser search error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: `Failed to search for "${query}"`,
      };
    } finally {
      if (page) await page.close();
      if (browser) await browser.close();
    }
  },
});

export const browserNavigateTool = createTool({
  name: "browser_navigate",
  description: "Navigate to a specific site and extract text or screenshots",
  schema: z.object({
    url: z.string().describe("The URL to navigate to"),
    extractText: z.boolean().optional().default(true),
    takeScreenshot: z.boolean().optional().default(false),
    selector: z.string().optional(),
  }),
  fn: async ({ url, extractText, takeScreenshot, selector }) => {
    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
      console.log(`🌐 Navigating to: ${url}`);
      browser = await launchBrowser();

      page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720 });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      );

      await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });

      let content: string | null = null;
      let screenshot: string | null = null;

      if (extractText) {
        if (selector) {
          await page.waitForSelector(selector, { timeout: 5000 });
          content = await page.evaluate((sel) => {
            const el = (document as any).querySelector(sel);
            return el ? el.textContent?.trim() : "Element not found";
          }, selector);
        } else {
          content = await page.evaluate(() => {
            const scripts = (document as any).querySelectorAll("script, style");
            scripts.forEach((el: any) => el.remove());
            return document.body?.textContent?.trim() || "No content found";
          });
        }
      }

      if (takeScreenshot) {
        screenshot = await page.screenshot({
          type: "png",
          fullPage: true,
          encoding: "base64",
        });
      }

      return {
        success: true,
        url,
        content:
          content && content.length > 2000
            ? content.substring(0, 2000) + "..."
            : content,
        screenshot: screenshot ? `data:image/png;base64,${screenshot}` : null,
        message: `✅ Successfully navigated to ${url}`,
      };
    } catch (error) {
      console.error("❌ Browser navigation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: `Failed to navigate to ${url}`,
      };
    } finally {
      if (page) await page.close();
      if (browser) await browser.close();
    }
  },
});
