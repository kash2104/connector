'use client';
import { signIn, signOut, useSession } from "next-auth/react";
import Navbar from "./components/Home/Navbar";
import Hero from "./components/Home/Hero";
import Features from "./components/Home/Features";
import HowItWorks from "./components/Home/HowItWorks";
import CTA from "./components/Home/CTA";
import Footer from "./components/Home/Footer";

export default function Home() {
  const session = useSession();
  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100">
      <Navbar/>

      <main>
        <Hero/>
        <Features/>
        <HowItWorks/>
        {/* <CTA/> */}
      </main>
      <Footer/>
      
      {/* {
        !session?.data?.user && 
      <button onClick={() => signIn('google')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign in with google
      </button>
      }

      {
        session?.data?.user && 
        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Sign out
        </button>
      } */}
    </div>
  );
}
