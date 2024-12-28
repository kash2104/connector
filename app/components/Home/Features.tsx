import { Upload, Eye, Youtube } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const features = [
  {
    title: "Easy Upload",
    description: "Drag, drop, done. Simple video uploads for editors.",
    icon: Upload,
    color: "text-[#38BDF8]",
  },
  {
    title: "Instant Preview",
    description: "Review edits in real-time. No downloads needed.",
    icon: Eye,
    color: "text-[#818CF8]",
  },
  {
    title: "Quick Publish",
    description: "One-click YouTube upload. Streamline your workflow.",
    icon: Youtube,
    color: "text-[#F472B6]",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Powerful Features for both Creators and Editors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-[#1E293B] border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <feature.icon className={`w-12 h-12 mb-4 ${feature.color} mx-auto`} />
                <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

