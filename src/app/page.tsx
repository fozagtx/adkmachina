import { Mic, Sparkles, Video, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Video,
    title: "Script Generation",
    description:
      "Generate compelling product scripts tailored to your brand voice and target audience.",
    accent: "from-purple-500/30 via-purple-500/10 to-transparent",
    iconBg: "bg-purple-500/20 text-purple-100",
  },
  {
    icon: Mic,
    title: "Voice Synthesis",
    description:
      "Convert scripts into natural-sounding voiceovers with customizable tones and styles.",
    accent: "from-pink-500/30 via-pink-400/10 to-transparent",
    iconBg: "bg-pink-500/20 text-pink-100",
  },
  {
    icon: Zap,
    title: "Instant Export",
    description:
      "Download your scripts and audio files instantly, ready for your video production.",
    accent: "from-blue-500/30 via-blue-400/10 to-transparent",
    iconBg: "bg-blue-500/20 text-blue-100",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0b0b1f] via-[#0f172a] to-[#05050d]"
        aria-hidden="true"
      />
      <div
        className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-purple-600/40 blur-3xl md:h-[36rem] md:w-[36rem]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-[-14rem] h-[30rem] bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.28),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-semibold"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-white/10">
              <Sparkles className="size-6 text-purple-300" />
            </span>
            <span className="tracking-tight">UGC Studio</span>
          </Link>
          <nav>
            <Link href="/workflow">
              <Button
                variant="ghost"
                size="lg"
                className="text-slate-100 hover:text-white"
              >
                Get Started
              </Button>
            </Link>
          </nav>
        </header>

        <main className="container mx-auto flex-1 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-12">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-16">
            <div className="space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 shadow-lg shadow-purple-500/20">
                ✨ Powered by ADK/T
              </div>
              <div className="space-y-6">
                <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl xl:text-7xl">
                  Create Authentic
                  <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_10px_40px_rgba(168,85,247,0.35)]">
                    UGC Content
                  </span>
                  <span className="block">For Your Products</span>
                </h1>
                <p className="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg md:text-xl">
                  Transform your product marketing with AI-generated scripts and
                  professional voiceovers. Produce stunning UGC videos in
                  minutes instead of hours.
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md space-y-5 sm:max-w-lg">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-60`}
                      aria-hidden="true"
                    />
                    <div className="relative flex items-start gap-4">
                      <span
                        className={`flex size-12 items-center justify-center rounded-2xl ${feature.iconBg}`}
                      >
                        <Icon className="size-6" />
                      </span>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-200">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-4 pb-12 text-center text-sm text-slate-300 sm:px-6 lg:px-12">
          <p className="mx-auto max-w-2xl">
            Trusted by product marketers, creators, and growth teams who need
            high-performing UGC content on demand.
          </p>
        </footer>
      </div>
    </div>
  );
}
