'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-[#1E293B] border-b border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#38BDF8]">Connector</Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild>
              <Link href="#features" className="text-lg font-medium text-gray-300 hover:text-[#38BDF8] transition-colors">Features</Link>
            </Button>
            <Button asChild>
              <Link href="#how-it-works" className="text-lg font-medium text-gray-300 hover:text-[#38BDF8] transition-colors">How It Works</Link>
            </Button>
            {/* <Button asChild>
              <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-[#38BDF8] transition-colors">Pricing</Link>
            </Button> */}
            {/* <Button variant="ghost" className="text-sm font-medium text-gray-300 hover:text-[#38BDF8]">
              <Link href="/login">Log In</Link>
            </Button> */}
            <Button className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-[#38BDF8]">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button asChild>
              <Link href="#features" className="block text-sm font-medium text-gray-300 hover:text-[#38BDF8] transition-colors">Features</Link>
            </Button>
            <Button asChild>
              <Link href="#how-it-works" className="block text-sm font-medium text-gray-300 hover:text-[#38BDF8] transition-colors">How It Works</Link>
            </Button>
            {/* <Button asChild>
              <Link href="/pricing" className="block text-sm font-medium text-gray-300 hover:text-[#38BDF8] transition-colors">Pricing</Link>
            </Button> */}
            <Button asChild>
              <Link href="/login" className="block text-sm font-medium text-gray-300 hover:text-[#38BDF8] transition-colors">Log In</Link>
            </Button>

            {/* <Button className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white mt-2">
              <Link href="/signup" className="w-full">Get Started</Link>
            </Button> */}
          </div>
        </div>
      )}
    </nav>
  )
}

