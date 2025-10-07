"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  loading?: boolean
}

export const ErrorState = ({ title = "Unable to Load Data", message, onRetry, loading = false }: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-red-500 to-rose-500 p-1">
        <div className="bg-white rounded-xl p-8">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">{message}</p>
            <div className="flex gap-4 justify-center">
              {onRetry && (
                <motion.button
                  onClick={onRetry}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                  Try Again
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Contact Support
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
