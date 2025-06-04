"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { GoogleIcon } from "../components/icons/google";

const fadeInVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function SignInPage() {
  const router = useRouter();
  const session = useSession();

  const handleGoogleSignIn = async () => {
    await signIn("google");
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      const name = session.data.user.name;
      if (session.data.user.role === "USER") {
        router.push("/user/choose-role");
      } else {
        router.push(`/user/dashboard/${name}`);
      }
    }
  }, [session]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Blurred Glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl z-0" />

      {/* Optional subtle animated background */}
      <motion.div
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_1px_1px,_#334155_1px,_transparent_0)] bg-[length:40px_40px] opacity-[0.04]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ delay: 0.5, duration: 1 }}
      />

      {/* Content */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
        <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
          <Button variant="ghost" className="text-gray-300 hover:text-blue-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="sm:inline">Back</span>
          </Button>
        </Link>
      </div>
      <motion.div
        className="relative z-10 w-full max-w-md space-y-8 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          variants={fadeInVariants}
        >
          Welcome to Connector
        </motion.h2>

        <motion.p
          className="text-gray-400 text-sm sm:text-base"
          variants={fadeInVariants}
        >
          Sign in to streamline your video workflow.
        </motion.p>

        <motion.div
          variants={fadeInVariants}
          className="w-max mx-auto flex justify-center items-center"
        >
          <Button
            onClick={handleGoogleSignIn}
            className=" w-full py-3 px-6 bg-white/90 text-gray-800 font-medium hover:bg-gray-100 transition duration-200 flex items-center justify-center gap-2"
          >
            <GoogleIcon className="h-5 w-5" />
            Sign in with Google
          </Button>
        </motion.div>

        <motion.p
          className="text-xs sm:text-sm text-gray-400 mt-4"
          variants={fadeInVariants}
        >
          By signing in, you agree to our{" "}
          <span className="text-blue-400 hover:underline cursor-pointer">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-blue-400 hover:underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </motion.p>
      </motion.div>
    </div>
  );
}
