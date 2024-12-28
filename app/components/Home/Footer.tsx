import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">CreatorConnect</h3>
            <p className="text-sm">Empowering creators and editors.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="hover:text-[#38BDF8] transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-[#38BDF8] transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-[#38BDF8] transition-colors">Pricing</Link></li>
              <li><Link href="/roadmap" className="hover:text-[#38BDF8] transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-[#38BDF8] transition-colors">Blog</Link></li>
              <li><Link href="/docs" className="hover:text-[#38BDF8] transition-colors">Docs</Link></li>
              <li><Link href="/help" className="hover:text-[#38BDF8] transition-colors">Help</Link></li>
              <li><Link href="/api" className="hover:text-[#38BDF8] transition-colors">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#38BDF8] transition-colors">About</Link></li>
              <li><Link href="/careers" className="hover:text-[#38BDF8] transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-[#38BDF8] transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-[#38BDF8] transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div> */}
        <div className="mt-8 pt-8 border-t border-[#334155] text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Connector. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

