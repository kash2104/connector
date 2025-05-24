"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle,
  UploadCloud,
  Eye,
  ThumbsUp,
  Youtube,

} from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const textContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const flowItemContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.75, 
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};



const connectorVerticalVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "100%", opacity: 1 },
};



const wordSwitchVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};


const flowStepsData = [
  {
    id: 1,
    icon: UploadCloud,
    title: "Editor Uploads Video",
    subtitle: "Securely shares the cut",
    iconColor: "text-blue-400",
  },
  
  {
    id: 2,
    icon: Eye,
    title: "Creator Previews In-App",
    subtitle: "No downloads needed",
    iconColor: "text-purple-400",
  },
  {
    id: 3,
    icon: ThumbsUp,
    title: "Creator Approves",
    subtitle: "One-click confirmation",
    iconColor: "text-teal-400",
  },
  {
    id: 4,
    icon: Youtube,
    title: "Direct YouTube Publish",
    subtitle: "Content goes live!",
    iconColor: "text-red-500",
  },
];

export default function HeroPage() {
  const [currentAudience, setCurrentAudience] = useState("Creators");
  const audiences = ["Creators", "Editors","Freelancers"];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAudience(prev => audiences[(audiences.indexOf(prev) + 1) % audiences.length]);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [audiences]);





  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-900 via-slate-900 to-black overflow-hidden">
      <motion.div
        className=" max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side: Text and Buttons */}
        <motion.div className="space-y-6 text-center lg:text-left" variants={textContentVariants}>
         
          <motion.span
            className=" text-left flex items-center gap-1.5 bg-gray-800 border border-gray-700 text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-lg max-w-max ml-2 mt-10"
            variants={textContentVariants}
          >
            For
            <span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={currentAudience}
                  variants={wordSwitchVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="inline-block"
                  >
                  {currentAudience}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            variants={textContentVariants}
          >
            Video Workflow:
            <br />
            Simplified & Accelerated
          </motion.h1>
          <motion.p className="text-lg text-gray-400" variants={textContentVariants}>
            Connect your video editing and publishing. Editors deliver, creators <span className="text-white">preview without downloading</span>, and approved videos launch straight to YouTube. Focus on creating, we'll handle the flow.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" variants={textContentVariants}>
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={"/auth"}>
                Streamline Your Workflow 🚀 
              
              </Link>
            </motion.button>
            <motion.button
              className="border border-gray-600 hover:bg-gray-700/50 text-gray-300 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              See It In Action <PlayCircle size={18} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Side: Animated Flowchart */}
        <motion.div className="flex flex-col items-center space-y-0" variants={flowItemContainerVariants}>
          {flowStepsData.map((step, index) => (
            <motion.div key={step.id} className="flex flex-col items-start" >
              {/* Flowchart Card */}
              <motion.div
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-4 rounded-lg shadow-xl flex items-center justify-between  w-[350px] relative"
                variants={cardVariants}
                
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gray-700/50 rounded-md ${step.iconColor}`}>
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100">{step.title}</h3>
                    <p className="text-xs text-gray-500">{step.subtitle}</p>
                  </div>
                </div>
              </motion.div>

              {/* Connector (except for the last item) */}
              {index < flowStepsData.length - 1 && (
                <div
                  className="relative h-10 sm:h-12" // Height of the connector area
                  style={{ marginLeft: `${index * 20 + 20}px` }} // Align with card's icon area + indent
                >
                  {/* Vertical part of L */}
                  <motion.div
                    className="absolute left-0 top-0 h-full w-0.5 bg-slate-700 origin-top"
                    variants={connectorVerticalVariants}
                  >
                    <div className="h-full w-full border-l-2 border-dashed border-blue-600" ></div>
                  </motion.div>
                  
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}