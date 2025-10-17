"use client";

import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Volume2 } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

interface AudioOutputNodeProps {
  data: {
    audioUrl?: string | null;
  };
}

const inputHandleStyle: CSSProperties = {
  background: "#a855f7",
  border: "2px solid rgba(236, 72, 153, 0.65)",
  width: 12,
  height: 12,
};

export const AudioOutputNode = ({ data }: AudioOutputNodeProps) => {
  const hasAudio = Boolean(data.audioUrl);

  const downloadAudio = () => {
    if (!data.audioUrl) return;
    const link = document.createElement("a");
    link.href = data.audioUrl;
    link.download = `ugc_voiceover_${Date.now()}.mp3`;
    link.click();
  };

  return (
    <div className="relative w-[360px] overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-white/10 via-purple-500/10 to-purple-500/5 p-6 shadow-[0_28px_60px_-25px_rgba(168,85,247,0.75)] backdrop-blur-2xl text-white">
      <div className="pointer-events-none absolute -top-28 left-0 h-48 w-48 rounded-full bg-purple-500/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-48 w-48 rounded-full bg-pink-500/30 blur-[120px]" />

      <Handle
        type="target"
        position={Position.Left}
        id="audio-input"
        style={inputHandleStyle}
      />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between gap-3 drag-handle cursor-move">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-500/25 p-3 backdrop-blur">
              <Volume2 className="h-5 w-5 text-purple-100" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Audio Output</h3>
              <p className="text-xs text-purple-100/70">
                Studio-grade voiceover render
              </p>
            </div>
          </div>
          {hasAudio ? (
            <div className="rounded-full bg-emerald-400/20 px-3 py-1 text-[11px] font-medium text-emerald-200">
              Ready
            </div>
          ) : (
            <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-purple-100/70">
              Awaiting input
            </div>
          )}
        </div>

        {hasAudio ? (
          <div className="space-y-4">
            <audio
              controls
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-2"
            >
              <source src={data.audioUrl ?? ""} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <Button
              onClick={downloadAudio}
              variant="premium"
              className="h-12 w-full rounded-full text-sm font-semibold shadow-[0_15px_45px_-15px_rgba(236,72,153,0.6)] transition hover:shadow-[0_18px_50px_-15px_rgba(236,72,153,0.7)]"
            >
              <DownloadCloud className="h-4 w-4" />
              Download voice-over
            </Button>
            <p className="text-xs text-purple-100/70">
              Optimized for TikTok, Reels, and high-converting ad creatives.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
              <Volume2 className="h-6 w-6 text-purple-100" />
            </div>
            <p className="mt-4 text-sm font-medium text-white">
              Awaiting your first voice-over
            </p>
            <p className="mt-2 text-xs text-purple-100/70">
              Generate a script to unlock a polished narration tailored to your product.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
