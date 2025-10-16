import { createTool } from "@iqai/adk";
import { z } from "zod";

export const clipTool = createTool({
  name: "clip_video",
  description: "Clip a video from start time with specified duration",
  schema: z.object({
    startTime: z.string().describe("Start time in HH:MM:SS format"),
    duration: z.string().describe("Duration in HH:MM:SS format"),
  }),
  fn: async ({ startTime, duration }) => {
    return `Video clip requested: Start at ${startTime}, Duration: ${duration}. Upload functionality coming soon.`;
  },
});
