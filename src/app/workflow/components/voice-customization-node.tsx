"use client";

import { Mic } from "lucide-react";

const tones = [
  { id: "energetic", name: "Energetic" },
  { id: "calm", name: "Calm" },
  { id: "professional", name: "Professional" },
  { id: "funny", name: "Funny" },
  { id: "dramatic", name: "Dramatic" },
];

export const VoiceCustomizationNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-[300px] border-2 border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Mic className="h-5 w-5" />
        <h3 className="font-semibold text-lg">Customize Voice</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {tones.map((tone) => (
          <div
            key={tone.id}
            onClick={() => data.onToneSelect(tone.id)}
            className={`p-4 border rounded-lg cursor-pointer text-center ${
              data.selectedTone === tone.id
                ? "border-gray-800 bg-gray-100"
                : "border-gray-300"
            }`}
          >
            {tone.name}
          </div>
        ))}
      </div>
    </div>
  );
};