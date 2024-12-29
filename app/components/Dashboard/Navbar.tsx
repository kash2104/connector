'use client'

import { LogOut } from 'lucide-react'
import { signOut } from "next-auth/react"
import { Button } from '../ui/button'

const Navbar = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-[#1E293B] text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-[#38BDF8]">Connector</div>
      <Button 
        onClick={handleLogout}
        variant="ghost" 
        className="text-gray-300 hover:text-[#38BDF8] transition-colors text-lg"
      >
        <LogOut className="mr-2" size={20} />
        Logout
      </Button>
    </nav>
  )
}

export default Navbar

