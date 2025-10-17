import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Video, Mic, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white min-h-screen flex flex-col">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="size-8 text-purple-500" />
            <span>UGC Studio</span>
          </Link>
        </div>
        <nav>
          <Link href="/workflow">
            <Button variant="ghost" className="hover:text-purple-400">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">
                ✨ AI-Powered Content Creation
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Create Authentic
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                UGC Content
              </span>
              <span className="block">For Your Products</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transform your product marketing with AI-generated scripts and
              professional voiceovers. Create engaging UGC videos in minutes,
              not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/workflow">
                <Button
                  variant="premium"
                  className="w-full sm:w-auto rounded-full text-lg py-6 px-10 hover:scale-105 transition-transform"
                >
                  Start Creating Free
                </Button>
              </Link>
              <Link href="/workflow">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-full text-lg py-6 px-10 bg-white/10 border-white/20 hover:bg-white/20"
                >
                  See How It Works
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              No credit card required • Generate unlimited scripts
            </p>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="grid grid-cols-1 gap-6 max-w-md w-full">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Video className="size-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Script Generation</h3>
                    <p className="text-sm text-gray-400">AI-powered hooks & CTAs</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Generate compelling product scripts tailored to your brand voice and target audience.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-pink-500/20 rounded-xl">
                    <Mic className="size-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Voice Synthesis</h3>
                    <p className="text-sm text-gray-400">Professional quality audio</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Convert scripts into natural-sounding voiceovers with customizable tones and styles.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Zap className="size-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Instant Export</h3>
                    <p className="text-sm text-gray-400">Ready to use content</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Download your scripts and audio files instantly, ready for your video production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-400 text-sm">
        <p>Trusted by product marketers and content creators worldwide</p>
      </footer>
    </div>
  );
}
