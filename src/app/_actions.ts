"use server";

import { getRootAgent } from "@/agents";
import { writeFile, mkdir } from "node:fs/promises";
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
    const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");

    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    return {
      success: true,
      filename,
      path: filepath,
      publicUrl: `/uploads/videos/${filename}`,
    };
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload file";
    throw new Error(errorMessage);
  }
}

export async function askAgent(
  message: string,
  avatarType: string,
  tone: string,
) {
  const { runner } = await getRootAgent();

  const result = await runner.ask(message, {
    avatarType,
    tone,
  });

  return result;
}
