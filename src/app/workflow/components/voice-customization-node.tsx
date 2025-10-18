"use client";

import { Handle, Position } from "@xyflow/react";
import { Mic } from "lucide-react";
import type { VoiceTone } from "@/agents/sub-agents/voiceAgent/voiceover";

const tones: Array<{ id: VoiceTone; name: string; emoji: string }> = [
  { id: "energetic", name: "Energetic", emoji: "⚡" },
  { id: "calm", name: "Calm", emoji: "🌊" },
  { id: "professional", name: "Professional", emoji: "💼" },
  { id: "funny", name: "Funny", emoji: "😄" },
  { id: "dramatic", name: "Dramatic", emoji: "🎭" },
];

interface VoiceCustomizationNodeData {
  selectedTone?: VoiceTone;
  onToneSelect?: (tone: VoiceTone) => void;
}

export const VoiceCustomizationNode = ({
  data = {} as VoiceCustomizationNodeData,
}: {
  data: VoiceCustomizationNodeData;
}) => {
  return (
    <div className="w-full max-w-[320px] rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-xl sm:p-6">
      <Handle
        type="target"
        position={Position.Left}
        id="tone-input"
        style={{ background: "#6366f1" }}
      />
      <div className="mb-4 flex items-center gap-2 drag-handle cursor-move">
        <Mic className="h-5 w-5 text-pink-600" />
        <div>
          <h3 className="text-lg font-semibold">Voice Tone</h3>
          <p className="text-xs text-gray-500">Select style</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {tones.map((tone) => (
          <button
            key={tone.id}
            type="button"
            onClick={() => data.onToneSelect?.(tone.id)}
            className={`rounded-xl border-2 p-3 text-center transition-all hover:scale-105 ${
              data.selectedTone === tone.id
                ? "border-indigo-600 bg-indigo-50 shadow-md"
                : "border-gray-300 hover:border-gray-400"
            }`}
            aria-label={`Select ${tone.name} tone`}
          >
            <div className="mb-1 text-2xl">{tone.emoji}</div>
            <div className="text-xs font-medium">{tone.name}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900">
        <span className="font-semibold">Selected:</span>{" "}
        {tones.find((t) => t.id === data.selectedTone)?.name || "Professional"}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="tone-output"
        style={{ background: "#6366f1" }}
      />
    </div>
  );
};
