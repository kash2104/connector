import Link from "next/link"
import { Button } from "../ui/button"

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#38BDF8] to-[#818CF8] text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Ready to Revolutionize?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Experience the future of creator-editor collaboration.
        </p>
        <Button size="lg" className="bg-white text-[#38BDF8] hover:bg-gray-100">
          <Link href="/signup">Start Free Trial</Link>
        </Button>
      </div>
    </section>
  )
}

