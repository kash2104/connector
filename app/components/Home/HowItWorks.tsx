import { CheckCircle } from 'lucide-react'

const steps = [
  "Editor uploads video",
//   "Creator gets notified",
  "Creator previews in-app",
  "Creator approves",
  "Video queued for YouTube"
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1E293B]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
        <div className="space-y-4 sm:space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center bg-[#2D3748] p-4 sm:p-6 rounded-lg shadow-md">
              <div className="flex-shrink-0 mr-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#38BDF8] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

