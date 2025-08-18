"use client"
import { motion } from "framer-motion"

const ClientHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
          className="space-y-6"
        >
          {/* Welcome text */}
          <motion.h1
            className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-2xl md:text-3xl text-gray-700 font-medium tracking-wide"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            to Your Turf Home
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 128, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          />

          {/* Pulsing glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-cyan-400/10 rounded-3xl blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Floating icons around the text */}
        <motion.div
          className="absolute -top-16 -left-16 w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          }}
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute -top-8 -right-20 w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            y: [10, -10, 10],
            rotate: [360, 0],
          }}
          transition={{
            y: { duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            rotate: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          }}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute -bottom-12 -left-12 w-8 h-8 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            y: [-5, 15, -5],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

export default ClientHomePage
