"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface CopyButtonProps {
  onCopy: () => void;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "default" | "sm" | "lg";
  className?: string;
}

export function CopyButton({
  onCopy,
  variant = "ghost",
  size = "icon",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500 transition-all" />
      ) : (
        <Copy className="h-4 w-4 transition-all" />
      )}
    </Button>
  );
}
