import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Code,
  ImageIcon,
  Mic,
  Music,
  Settings,
  VideoIcon,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tools = [
  {
    label: "Conversation",
    icon: Bot,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
  },
];

export default function LandingPage() {
  return (
    <div>
      <div className="group relative w-full overflow-hidden text-white">
        <div className="relative z-20 flex min-h-screen flex-col items-center justify-center gap-y-5">
          <div className="max-w-4xl font-bold">
            <h1 className="text-center text-4xl text-white md:text-5xl lg:text-6xl">
              The Best AI Tool for
            </h1>
            <div className="mt-4 text-center text-4xl text-transparent md:text-5xl lg:text-6xl">
              <div className="animate-text-reveal-2 inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2">
                Content Creators
              </div>
            </div>
          </div>
          <div className="max-w-sm text-center text-sm text-zinc-200 md:text-xl">
            Create{" "}
            <span className="font-semibold text-white">
              10x faster, better and with less effort
            </span>
          </div>
          <div>
            <Link href="/workflow">
              <Button
                variant="premium"
                className="rounded-full md:text-lg p-4 md:p-6"
              >
                Start Generating For Free
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

      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            key={tool.label}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={`p-2 w-fit rounded-md ${tool.bgColor}`}>
                <tool.icon className={`w-8 h-8 ${tool.color}`} />
              </div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
}