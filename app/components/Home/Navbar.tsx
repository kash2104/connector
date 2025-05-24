"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <nav className="hidden md:block fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#1E293B]/60 border-b border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-400">
              Connector
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link
                href="#features"
                className="text-lg font-medium text-gray-400 hover:text-white transition-colors"
              >
                Features
              </Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors duration-300">
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
