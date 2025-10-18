"use client";

import { Handle, Position } from "@xyflow/react";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScriptInputNodeData {
  script: string;
  onScriptChange: (value: string) => void;
  onPaste: () => void;
  onClear: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ScriptInputNode = ({
  data = {} as ScriptInputNodeData,
}: {
  data: ScriptInputNodeData;
}) => {
  return (
    <div className="w-full max-w-[340px] rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-xl sm:p-6">
      <div className="mb-4 flex items-center gap-2 drag-handle cursor-move">
        <FileText className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Script Input</h3>
      </div>
      <textarea
        value={data.script || ""}
        onChange={(e) => data.onScriptChange?.(e.target.value)}
        placeholder="Paste or type your script here..."
        className="h-28 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:h-32 sm:p-4"
        aria-label="Script input"
      />
      <div className="mt-2 text-xs text-gray-500 sm:text-sm">
        {(data.script || "").length} chars ·{" "}
        {(data.script || "").split(/\s+/).filter(Boolean).length} words
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          className="h-9 flex-1 rounded-lg text-xs font-medium sm:text-sm"
          onClick={data.onPaste || (() => {})}
          disabled={data.isGenerating}
        >
          Paste
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={data.onClear || (() => {})}
          disabled={data.isGenerating}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      <Button
        onClick={data.onGenerate || (() => {})}
        disabled={!data.script?.trim() || data.isGenerating}
        className="mt-3 h-9 w-full rounded-lg bg-gradient-to-r from-purple-800 to-black text-xs font-semibold text-white transition"
      >
        {data.isGenerating ? "Generating..." : "Generate Voice-Over"}
      </Button>
      <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
        <span className="font-semibold">Tips:</span> Write in a conversational
        tone, include hooks, and keep scripts between 50-200 words for best
        results.
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="script-output"
        style={{ background: "#6366f1" }}
      />
    </div>
  );
};
