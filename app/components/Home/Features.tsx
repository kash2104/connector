'use client'
import { motion } from 'framer-motion'

const detailedFeaturesData = [
  {
    title: "Seamless Uploads",
    description: "Editors can effortlessly upload video cuts directly to the platform. Simplified uploads eliminates email chains and clunky file transfers keeping everything organized in one place. All uploads are securely stored 99% durability, so you never have to worry about losing a file.",
    iconColor: "text-blue-400",
    imageSrc: "/images/easy-video-upload.png", 
    imageAlt: "Image of editor video upload interface",
  },
  {
    title: "In-App Previews",
    description: "Creators can preview high-resolution videos instantly within the app. No more waiting for downloads or dealing with incompatible players. Review on any device, anywhere.",
    iconColor: "text-purple-400",
    imageSrc: "/images/in-app-preview.png",
    imageAlt: "Image of in-app video preview for creators",
  },
  {
    title: "One-Click Publish",
    description: "Once approved, videos are published directly to the connected YouTube channel with a single click. Save hours of manual uploads and ensure your content goes live without hassle.",
    iconColor: "text-red-500",
    imageSrc: "/images/one-click-publish.png",
    imageAlt: "Image showing direct YouTube publishing settings",
  },
];

const featureRowVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const textContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


export default function Features() {
  return (
     <section id='features' className="py-16 sm:py-24 bg-gray-900 overflow-hidden"> {/* Different bg or same as hero */}
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.2 }}
          className="text-center mb-12 sm:mb-20"
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white opacity-85 bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 mb-4" // Different gradient
            variants={textContentVariants}
          >
            Core Features
          </motion.h2>
          <motion.p className="text-lg text-gray-400 max-w-2xl mx-auto" variants={textContentVariants}>
            Cut the busywork, boost collaboration, and showcase your edge.
          </motion.p>
        </motion.div>

        <div className="space-y-16 sm:space-y-24">
          {detailedFeaturesData.map((feature, index) => (
            <motion.div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
              variants={featureRowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Text Content - Order changes based on index */}
              <div className={`space-y-5 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className={`inline-flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 ${feature.iconColor}`}>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-100">{feature.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed sm:text-lg">{feature.description}</p>
                
              </div>

              {/* Image/Visual Content - Order changes based on index */}
              <div className={`relative ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <motion.div
                  className="bg-slate-800 p-2 sm:p-3 rounded-xl shadow-2xl border border-slate-700"
                  whileHover={{ scale: 1.03, boxShadow: "0px 10px 30px rgba(0,0,0,0.3)"}}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Replace with Next/Image for optimization if images are large */}
                  <img
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    className="rounded-lg w-full h-auto object-cover aspect-video" // aspect-video for consistent ratio
                  />
                </motion.div>
                 {/* Optional: Decorative element */}
                <div className="hidden lg:block absolute -top-8 -left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -z-10"></div>
                <div className="hidden lg:block absolute -bottom-8 -right-8 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -z-10"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

