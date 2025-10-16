"use client";

import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

export const AudioOutputNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] border-2 border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="h-5 w-5" />
        <div>
          <h3 className="font-semibold text-lg">Audio Output</h3>
          <p className="text-sm text-gray-500">Generated voice-over playback</p>
        </div>
      </div>

      {data.audioUrl ? (
        <div className="space-y-4">
          <audio controls className="w-full">
            <source src={data.audioUrl} type="audio/mpeg" />
          </audio>
          <Button
            onClick={() => {
              const a = document.createElement("a");
              a.href = data.audioUrl;
              a.download = "voiceover.mp3";
              a.click();
            }}
            className="w-full"
          >
            Download Audio
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Volume2 className="h-16 w-16 mb-4" />
          <p className="text-lg font-medium text-gray-600">
            No audio generated yet
          </p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Paste the script text and generate voice-over
          </p>
        </div>
      )}
    </div>
  );
};