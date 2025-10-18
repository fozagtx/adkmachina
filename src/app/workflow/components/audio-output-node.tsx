"use client";

import { Handle, Position } from "@xyflow/react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioOutputNodeProps {
  data: {
    audioUrl?: string | null;
  };
}

export const AudioOutputNode = ({ data }: AudioOutputNodeProps) => {
  return (
    <div className="w-full max-w-[340px] rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-xl sm:p-6">
      <Handle
        type="target"
        position={Position.Left}
        id="audio-input"
        style={{ background: "#6366f1" }}
      />
      <div className="mb-4 flex items-center gap-2 drag-handle cursor-move">
        <Volume2 className="h-5 w-5 text-indigo-600" />
        <div>
          <h3 className="text-lg font-semibold">Audio Output</h3>
          <p className="text-xs text-gray-500">Generated voice-over playback</p>
        </div>
      </div>

      {data.audioUrl ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <audio
              controls
              className="w-full"
              onError={(e) => {
                console.error("Audio playback error:", e);
              }}
            >
              <source
                src={data.audioUrl || ""}
                type="audio/mpeg"
                onError={(e) => console.error("Source error:", e)}
              />
              Your browser does not support the audio element.
            </audio>
          </div>
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
                a.click();
              } catch (error) {
                console.error("Download error:", error);
              }
            }}
            className="h-9 w-full rounded-lg bg-gradient-to-r from-purple-800 to-black text-xs font-semibold text-white transition"
            disabled={!data.audioUrl}
          >
            Download Audio
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-gray-400 sm:py-12">
          <Volume2 className="mb-3 h-12 w-12" />
          <p className="text-base font-medium text-gray-600">
            No audio generated yet
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">
            Paste the script text and generate voice-over
          </p>
        </div>
      )}
    </div>
  );
};
