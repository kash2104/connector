"use client"

import {  signIn, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Button } from "../components/ui/button"
import { GoogleIcon } from "../components/icons/google"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



export default function SignInPage() {
    const router = useRouter();
    const session = useSession();
    const handleGoogleSignIn = async() => {
        await signIn("google");
    }

    useEffect(() => {
        if(session.status === "authenticated"){
            if (session.data.user.role === "USER") {
                router.push("/choose-role");
              } else if (session.data.user.role === "CREATOR") {
                router.push(`/user/dashboard?name=${session.data.user.name}`);
              } else {
                router.push(`/user/dashboard?name=${session.data.user.name}`);
              }
        }
    },[session])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <Button variant="ghost" className="text-gray-300 hover:text-[#38BDF8]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      </Link>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {/* <Image
            src="/placeholder.svg?height=64&width=64"
            alt="CreatorConnect Logo"
            width={64}
            height={64}
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20"
          /> */}
          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">
            Welcome to Connector
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-400">
            Sign in to try
          </p>
        </div>
        <Button 
          onClick={handleGoogleSignIn}
          className="w-full py-2 px-4 sm:py-3 sm:px-6 bg-white text-[#1E293B] hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
        >
          <GoogleIcon className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>
        <div className="mt-3 text-center text-xs sm:text-sm text-gray-400">
          By clicking continue, you agree to our{" "}
          <p
            // href="/terms"
            className="font-medium text-[#38BDF8] hover:text-[#0EA5E9]"
          >
            Terms of Service
          </p>{" "}
          and{" "}
          <p
            // href="/privacy"
            className="font-medium text-[#38BDF8] hover:text-[#0EA5E9]"
          >
            Privacy Policy
          </p>
          
        </div>
      </div>
    </div>
  )
}

