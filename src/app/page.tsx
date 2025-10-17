import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="group relative w-full overflow-hidden text-white">
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center gap-y-5">
        <div className="max-w-4xl font-bold">
          <h1 className="text-center text-4xl text-white md:text-5xl lg:text-6xl">
            Automate Your Workflows
          </h1>
          <div className="mt-4 text-center text-4xl text-transparent md:text-5xl lg:text-6xl">
            <div className="animate-text-reveal-2 inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2">
              With AI
            </div>
          </div>
        </div>
        <div className="max-w-sm text-center text-sm text-zinc-200 md:text-xl">
          Create and automate workflows with AI agents.
        </div>
        <div>
          <Link href="/workflow">
            <Button
              variant="premium"
              className="rounded-full md:text-lg p-4 md:p-6"
            >
              Get Started
            </Button>
          </Link>
        </div>
        <div className="text-xs font-semibold text-zinc-400 md:text-sm">
          No credit card required.
        </div>
      </div>
      <div className="absolute inset-0 z-10 bg-black/70" />
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
      >
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}