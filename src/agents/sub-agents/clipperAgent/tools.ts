import { createTool } from "@iqai/adk";
import { z } from "zod";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import path from "node:path";
import fs from "node:fs/promises";
import { parseTimeToHHMMSS } from "@/lib/time-utils";

ffmpeg.setFfmpegPath(ffmpegStatic as string);

export const clipTool = createTool({
  name: "clip_video",
  description:
    "Clip a video from start time with specified duration. Accepts simple formats like '5s', '2m', '1:30'",
  schema: z.object({
    videoPath: z.string().describe("Path to the uploaded video file"),
    startTime: z.string().describe("Start time: '5s', '2m', '1:30', etc"),
    duration: z.string().describe("Duration: '10s', '2m', '0:30', etc"),
  }),
  fn: async ({ videoPath, startTime, duration }) => {
    try {
      await fs.access(videoPath);

      const parsedStartTime = parseTimeToHHMMSS(startTime);
      const parsedDuration = parseTimeToHHMMSS(duration);

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
          .setStartTime(parsedStartTime)
          .setDuration(parsedDuration)
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
