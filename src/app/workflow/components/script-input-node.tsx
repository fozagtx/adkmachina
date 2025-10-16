"use client";

import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";

export const ScriptInputNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-[450px] border-2 border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5" />
        <h3 className="font-semibold text-lg">Script Input</h3>
      </div>
      <textarea
        value={data.script}
        onChange={(e) => data.onScriptChange(e.target.value)}
        placeholder="Paste or type your script here..."
        className="w-full h-48 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <div className="text-sm text-gray-500 mt-2">
        {data.script.length} chars ·{" "}
        {data.script.split(/\s+/).filter(Boolean).length} words
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={data.onPaste}>
          Paste
        </Button>
        <Button variant="ghost" size="icon" onClick={data.onClear}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      <Button
        onClick={data.onGenerate}
        disabled={!data.script || data.isGenerating}
        className="w-full mt-3 bg-gray-700 hover:bg-gray-800"
      >
        {data.isGenerating ? "Generating..." : "Generate Voice-Over"}
      </Button>
      <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
        <span className="font-semibold">Tips:</span> Write in a conversational
        tone, include hooks, and keep scripts between 50-200 words for best
        results.
      </div>
    </div>
  );
};