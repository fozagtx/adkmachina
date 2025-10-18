import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="mx-4 md:mx-0">
      <div className="bg-[#1D1D1D]/80 backdrop-blur-md border border-white/10 rounded-2xl max-w-3xl mx-auto mt-4 pl-4 pr-6 flex items-center justify-between h-16">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-medium hidden md:block text-white">
              Relo
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link
            href="/studio"
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 hover:bg-white/20 transition-all"
          >
            Create
          </Link>
        </nav>
      </div>
    </header>
  );
}
