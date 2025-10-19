import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">Relo</span>
          <span className="rounded-md border border-black px-2 py-1 text-sm font-bold">
            Studio
          </span>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="flex max-w-6xl items-center justify-between">
          <div className="flex flex-col items-start space-y-6 text-left">
            <h1 className="text-6xl font-bold tracking-tight">
              Create UGC faster
            </h1>
            <p className="max-w-md text-lg text-gray-600">
              Relo AI quietly , ideates, plans UGC content for users from idea
              to voiceover pluf filming advice .
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/studio"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl"
              >
                <span>Get started</span>
              </Link>
            </div>
          </div>
          <div className="relative">
            <video
              src="/delight.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-[500px] h-[500px] rounded-full object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
