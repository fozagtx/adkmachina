"use client";

import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Trash2 } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

interface ScriptInputNodeData {
  script: string;
  onScriptChange: (value: string) => void;
  onPaste: () => void;
  onClear: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const outputHandleStyle: CSSProperties = {
  background: "#a855f7",
  border: "2px solid rgba(236, 72, 153, 0.65)",
  width: 12,
  height: 12,
};

export const ScriptInputNode = ({
  data = {} as ScriptInputNodeData,
}: {
  data: ScriptInputNodeData;
}) => {
  const script = data.script ?? "";
  const charCount = script.length;
  const wordCount = script
    ? script.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="relative w-[360px] overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-white/10 via-purple-500/10 to-purple-500/5 p-6 shadow-[0_28px_60px_-25px_rgba(168,85,247,0.75)] backdrop-blur-2xl text-white">
      <div className="pointer-events-none absolute -top-28 -left-24 h-48 w-48 rounded-full bg-purple-500/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-48 w-48 rounded-full bg-pink-500/30 blur-[120px]" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 drag-handle cursor-move">
            <div className="rounded-2xl bg-purple-500/25 p-3 backdrop-blur">
              <FileText className="h-5 w-5 text-purple-100" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Script Canvas</h3>
              <p className="text-xs text-purple-100/70">
                Craft scroll-stopping product hooks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] text-purple-100/80">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI copy assist</span>
          </div>
        </div>

        <textarea
          value={script}
          onChange={(e) => data.onScriptChange?.(e.target.value)}
          placeholder="Introduce your product, highlight the transformation, and close with a confident CTA..."
          className="h-36 w-full rounded-2xl border border-white/15 bg-black/20 p-4 text-sm leading-relaxed text-white placeholder:text-purple-100/40 focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/40 focus:outline-none transition"
        />

        <div className="flex items-center justify-between text-xs text-purple-100/70">
          <span>{charCount} characters</span>
          <span>{wordCount} words</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10 rounded-full border-white/25 bg-white/15 text-purple-100 hover:border-white/40 hover:bg-white/25 transition"
            onClick={data.onPaste || (() => {})}
          >
            Paste from clipboard
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-pink-200 hover:bg-white/20"
            onClick={data.onClear || (() => {})}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={data.onGenerate || (() => {})}
          disabled={!script || data.isGenerating}
          variant="premium"
          className="h-12 w-full rounded-full text-sm font-semibold shadow-[0_15px_45px_-15px_rgba(236,72,153,0.6)] transition hover:shadow-[0_18px_50px_-15px_rgba(236,72,153,0.7)] disabled:opacity-50 disabled:shadow-none"
        >
          {data.isGenerating ? "Generating voice-over..." : "Generate Voice-Over"}
        </Button>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-purple-100/80">
          <p className="font-semibold text-purple-50/90">Creator tip</p>
          <p className="mt-2 leading-relaxed">
            Lead with a problem, spotlight the product moment, and close with a
            confident CTA within 45-60 seconds.
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="script-output"
        style={outputHandleStyle}
      />
    </div>
  );
};
