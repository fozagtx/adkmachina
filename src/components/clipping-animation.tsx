import { cn } from "@/lib/utils";
import { Scissors } from "lucide-react";

interface ClippingAnimationProps {
  className?: string;
}

export function ClippingAnimation({ className }: ClippingAnimationProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-8",
        className,
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="relative rounded-full bg-primary/10 p-4">
          <Scissors
            size={48}
            className="animate-pulse text-primary"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold text-primary">
          Clipping Your Video
        </h3>
        <p className="text-center text-sm text-muted-foreground">
          Processing your video clip... This may take a moment
        </p>
      </div>

      <div className="flex gap-1">
        <div
          className="h-2 w-2 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="h-2 w-2 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="h-2 w-2 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
