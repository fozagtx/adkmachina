"use client";

import { User } from "lucide-react";

const avatars = [
  { id: "fitness", name: "Fitness Coach" },
  { id: "beauty", name: "Beauty Guru" },
  { id: "tech", name: "Tech Reviewer" },
  { id: "lifestyle", name: "Lifestyle Influencer" },
];

export const AvatarSelectionNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-[300px] border-2 border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5" />
        <h3 className="font-semibold text-lg">Select Avatar</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            onClick={() => data.onAvatarSelect(avatar.id)}
            className={`p-4 border rounded-lg cursor-pointer text-center ${
              data.selectedAvatar === avatar.id
                ? "border-gray-800 bg-gray-100"
                : "border-gray-300"
            }`}
          >
            {avatar.name}
          </div>
        ))}
      </div>
    </div>
  );
};