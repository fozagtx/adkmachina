"use client";

import type { CSSProperties } from "react";
import { Mic, Sparkles } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

const tones = [
  {
    id: "energetic",
    name: "Energetic",
    emoji: "⚡",
    description: "High-energy, hype-building intros",
  },
  {
    id: "calm",
    name: "Calm",
    emoji: "🧘",
    description: "Gentle storytelling with warmth",
  },
  {
    id: "professional",
    name: "Professional",
    emoji: "💼",
    description: "Confident and brand-forward",
  },
  {
    id: "funny",
    name: "Funny",
    emoji: "😄",
    description: "Playful with punchy timing",
  },
  {
    id: "dramatic",
    name: "Dramatic",
    emoji: "🎭",
    description: "Cinematic tension & intrigue",
  },
];

const handleStyle: CSSProperties = {
  background: "#a855f7",
  border: "2px solid rgba(236, 72, 153, 0.65)",
  width: 12,
  height: 12,
};

export const VoiceCustomizationNode = ({ data }: any) => {
  const selectedTone = data?.selectedTone ?? "professional";
  const handleToneSelect = data?.onToneSelect ?? (() => {});

  return (
    <div className="relative w-[360px] overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-white/10 via-pink-500/10 to-pink-500/5 p-6 shadow-[0_28px_60px_-25px_rgba(236,72,153,0.75)] backdrop-blur-2xl text-white">
      <div className="pointer-events-none absolute -top-28 -right-20 h-48 w-48 rounded-full bg-pink-500/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-purple-500/30 blur-[120px]" />

      <Handle
        type="target"
        position={Position.Left}
        id="voice-input"
        style={handleStyle}
      />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 drag-handle cursor-move">
            <div className="rounded-2xl bg-pink-500/25 p-3 backdrop-blur">
              <Mic className="h-5 w-5 text-pink-100" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Voice Designer</h3>
              <p className="text-xs text-pink-100/70">
                Select your voice personality
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] text-pink-100/80">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by ElevenLabs</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {tones.map((tone) => {
            const isSelected = selectedTone === tone.id;
            return (
              <button
                type="button"
                key={tone.id}
                onClick={() => handleToneSelect(tone.id)}
                className={`relative flex h-full flex-col gap-2 rounded-2xl border p-4 text-left transition-all duration-200
                  ${
                    isSelected
                      ? "border-pink-400/70 bg-gradient-to-br from-pink-400/25 via-purple-400/20 to-pink-400/10 shadow-[0_18px_40px_-18px_rgba(236,72,153,0.5)]"
                      : "border-white/15 bg-white/5 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
                  }`}
              >
                <span className="text-2xl">{tone.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{tone.name}</p>
                  <p className="text-[11px] leading-relaxed text-pink-100/70">
                    {tone.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.95)]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-pink-100/80">
          <p className="font-semibold text-pink-50/90">Creator tip</p>
          <p className="mt-2 leading-relaxed">
            Match the tone to the energy of your visuals—energetic for trending
            cuts, calm for ASMR-style demos, and dramatic for product reveals.
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="voice-output"
        style={handleStyle}
      />
    </div>
  );
};
