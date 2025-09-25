
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface PageHeaderProps {
  badge?: string
  title: string
  description: string
  loading?: boolean
}

export const PageHeader = ({ badge, title, description, loading }: PageHeaderProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
      {badge && (
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-100">
          {loading ? (
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {badge}
        </div>
      )}
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">{title}</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
    </motion.div>
  )
}
