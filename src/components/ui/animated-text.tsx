"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  className?: string;
  staticText: string;
  animatedTexts: string[];
}

export function AnimatedText({
  className,
  staticText,
  animatedTexts,
}: AnimatedTextProps) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % animatedTexts.length);
        setFade(true);
      }, 500); // fade-out duration
    }, 2000); // time each text is visible

    return () => clearInterval(interval);
  }, [animatedTexts.length]);

  return (
    <p className={cn("text-sm text-gray-500 font-bold", className)}>
      {staticText}{" "}
      <span
        className={cn(
          "transition-opacity duration-500",
          fade ? "opacity-100" : "opacity-0",
        )}
      >
        {animatedTexts[index]}
      </span>
    </p>
  );
}
