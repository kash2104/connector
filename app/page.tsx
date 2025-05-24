import Navbar from "./components/Home/Navbar";
import Hero from "./components/Home/Hero";
import Features from "./components/Home/Features";
import HowItWorks from "./components/Home/HowItWorks";
import Footer from "./components/Home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100">
      <Navbar/>

      <main>
        <Hero/>
        <Features/>
        <HowItWorks/>
      </main>
      <Footer/>
      
    </div>
  );
}
