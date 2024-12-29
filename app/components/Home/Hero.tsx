import Link from "next/link"
import { Button } from "../ui/button"

export default function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1E293B]">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
          Streamline Your <span className="text-[#38BDF8]">Content Creation</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Connect creators and editors. Upload, edit, and publish. All in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* <Button asChild size="lg" className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white">
            <Link href="/signup">Start Free Trial</Link>
          </Button> */}
          <Button asChild variant="outline" size="lg" className="text-[#38BDF8] border-[#38BDF8] hover:bg-[#38BDF8] hover:text-white">
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

