"use server";

import { getRootAgent } from "@/agents";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function uploadVideo(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}_${file.name}`;
    const filepath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "videos",
      filename,
    );

    await writeFile(filepath, buffer);

    return {
      success: true,
      filename,
      path: filepath,
      publicUrl: `/uploads/videos/${filename}`,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload file");
  }
}

export async function askAgent(message: string, videoPath?: string | null) {
  const { runner } = await getRootAgent();

  let fullMessage = message;
  if (videoPath) {
    fullMessage = `${message}\n\nUploaded video path: ${videoPath}`;
  }

  const result = await runner.ask(fullMessage);
  return result;
}
