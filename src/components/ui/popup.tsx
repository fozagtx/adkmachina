"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PopupProps {
  message: string;
  show: boolean;
  className?: string;
}

export function Popup({ message, show, className }: PopupProps) {
  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white shadow-lg transition-all duration-300",
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
        className,
      )}
    >
      {show && <Check className="animate-tick-in" size={16} />}
      <span>{message}</span>
    </div>
  );
}
