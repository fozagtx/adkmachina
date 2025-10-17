"use client";

import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

interface AudioOutputNodeProps {
  data: {
    audioUrl?: string | null;
  };
}

export const AudioOutputNode = ({ data }: AudioOutputNodeProps) => {
  console.log("Audio output node rendered with URL:", data.audioUrl);
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] border-2 border-gray-200">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
      />
      <div className="flex items-center gap-2 mb-4 drag-handle cursor-move">
        <Volume2 className="h-4 sm:h-5 w-4 sm:w-5" />
        <div>
          <h3 className="font-semibold text-base sm:text-lg">Audio Output</h3>
          <p className="text-xs sm:text-sm text-gray-500">
            Generated voice-over playback
          </p>
        </div>
      </div>

      {data.audioUrl ? (
        <div className="space-y-4">
          <audio
            controls
            className="w-full"
            onError={(e) => {
              console.error("Audio playback error:", e);
              e.currentTarget.classList.add("error");
            }}
            onLoadStart={() => console.log("Audio loading started")}
            onCanPlay={() => console.log("Audio can play now")}
          >
            <source
              src={data.audioUrl || ""}
              type="audio/mpeg"
              onError={(e) => console.error("Source error:", e)}
            />
            Your browser does not support the audio element.
          </audio>
          <Button
            onClick={() => {
              try {
                const a = document.createElement("a");
                if (!data.audioUrl) {
                  console.error("No audio URL available for download");
                  return;
                }
                a.href = data.audioUrl;
                a.download = `voiceover_${Date.now()}.mp3`;
                console.log("Initiating download:", a.href);
                a.click();
              } catch (error) {
                console.error("Download error:", error);
              }
            }}
            className="w-full text-xs sm:text-sm h-8 sm:h-10"
            disabled={!data.audioUrl}
          >
            Download Audio
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400">
          <Volume2 className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg font-medium text-gray-600">
            No audio generated yet
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-center">
            Paste the script text and generate voice-over
          </p>
        </div>
      )}
    </div>
  );
};