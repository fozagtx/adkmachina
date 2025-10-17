import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">adkmachina</Link>
        </div>
        <nav>
          <Link href="/workflow">
            <Button variant="ghost">Workflow</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Automate Your Workflows
              <span className="block bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                With AI
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Create, customize, and deploy AI agents to automate your tasks and
              workflows, without writing any code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/workflow">
                <Button
                  variant="premium"
                  className="w-full sm:w-auto rounded-full text-lg py-3 px-8"
                >
                  Get Started for Free
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-400">No credit card required.</p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/globe.svg"
              alt="AI Globe"
              width={500}
              height={500}
              className="animate-pulse"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
