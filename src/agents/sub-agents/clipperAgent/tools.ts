import { createTool } from "@iqai/adk";
import { z } from "zod";
import ffmpeg from "fluent-ffmpeg";
import path from "node:path";
import fs from "node:fs/promises";

/**
 * Tool for clipping videos using FFmpeg.
 *
 * Processes uploaded videos and creates clips based on start time and duration.
 * Stores processed clips in the public/uploads/clips directory.
 */
export const clipTool = createTool({
  name: "clip_video",
  description: "Clip a video from start time with specified duration",
  schema: z.object({
    videoPath: z.string().describe("Path to the uploaded video file"),
    startTime: z.string().describe("Start time in HH:MM:SS format"),
    duration: z.string().describe("Duration in HH:MM:SS format"),
  }),
  fn: async ({ videoPath, startTime, duration }) => {
    try {
      await fs.access(videoPath);

      const timestamp = Date.now();
      const outputFilename = `clip_${timestamp}.mp4`;
      const outputPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "clips",
        outputFilename,
      );

      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoPath)
          .setStartTime(startTime)
          .setDuration(duration)
          .output(outputPath)
          .on("end", () => resolve())
          .on("error", (err) => reject(err))
          .run();
      });

      const publicUrl = `/uploads/clips/${outputFilename}`;
      return `Video clipped successfully! Duration: ${duration} starting from ${startTime}. Download: ${publicUrl}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return `Error clipping video: ${errorMessage}`;
    }
  },
});
