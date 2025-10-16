import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#D3D1DE] relative overflow-hidden">
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-black">relo.dev</span>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-24 pb-20 max-w-5xl mx-auto">
        <h1 className="mb-8 text-center text-[64px] font-normal leading-tight text-black tracking-tight animate-pulse">
          Generate viral voiceovers
          <br />
          for your UGC avatars
        </h1>

        <Link href="/workflow">
          <Button className="bg-black text-white hover:bg-gray-900 rounded-xl px-12 py-4 text-lg font-medium shadow-2xl">
            Create Voiceover →
          </Button>
        </Link>
      </main>
    </div>
  );
}
