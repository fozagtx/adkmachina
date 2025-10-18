import { ArrowRight, Circle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col text-white">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/noice.png"
          alt="Background"
          fill
          className="object-cover object-center brightness-25 "
          priority
        />
      </div>

      <Header />
      <main className="flex flex-1 animate-fade_in flex-col items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg text-black animate-pulse font-bold">
            Built on ADKTS
          </p>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl text-black">
            Automate UGC Content.
          </h1>
          <Link
            href="/studio"
            className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-800 to-black px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 hover:ring-offset-pink-100"
          >
            <span>Start Automating</span>
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    </div>
  );
}
