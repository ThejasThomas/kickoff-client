import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react"
import type React from "react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning"|"success" ,
  loading?: boolean
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
  loading = false,
}) => {
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  const getVariantConfig = (variant: string) => {
    switch (variant) {
      case "danger":
        return {
          icon: AlertCircle,
          iconBg: "bg-red-500/10",
          iconColor: "text-red-400",
          accentGradient: "from-red-500/20 to-transparent",
          borderColor: "border-red-500/20",
          confirmBg: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600",
          confirmShadow: "shadow-lg shadow-red-500/25",
        }
      case "warning":
        return {
          icon: AlertTriangle,
          iconBg: "bg-yellow-500/10",
          iconColor: "text-yellow-400",
          accentGradient: "from-yellow-500/20 to-transparent",
          borderColor: "border-yellow-500/20",
          confirmBg: "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600",
          confirmShadow: "shadow-lg shadow-yellow-500/25",
        }
      default:
        return {
          icon: Info,
          iconBg: "bg-blue-500/10",
          iconColor: "text-blue-400",
          accentGradient: "from-blue-500/20 to-transparent",
          borderColor: "border-blue-500/20",
          confirmBg: "bg-gradient-to-r from-[#f69938] to-[#e58a2f] hover:from-[#e58a2f] hover:to-[#d67b28]",
          confirmShadow: "shadow-lg shadow-orange-500/25",
        }
    }
  }

  const config = getVariantConfig(variant)
  const Icon = config.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="pointer-events-auto w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            >
              <div className={`relative bg-gradient-to-b ${config.accentGradient} rounded-2xl overflow-hidden`}>
                {/* Glass morphism card */}
                <div className={`bg-gray-900/95 backdrop-blur-xl border ${config.borderColor} rounded-2xl shadow-2xl`}>
                  {/* Header */}
                  <div className="flex items-start gap-4 p-6 pb-4">
                    {/* Icon */}
                    <div className={`${config.iconBg} p-3 rounded-xl shrink-0`}>
                      <Icon size={24} className={config.iconColor} strokeWidth={2} />
                    </div>

                    {/* Title and Close */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-white leading-tight">{title}</h2>
                    </div>

                    <button
                      onClick={onClose}
                      disabled={loading}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      aria-label="Close modal"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Message */}
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">{message}</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 p-6 pt-4">
                    <button
                      onClick={onClose}
                      disabled={loading}
                      className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelText}
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={loading}
                      className={`
                        px-5 py-2.5 text-sm font-semibold text-white rounded-lg
                        ${config.confirmBg} ${config.confirmShadow}
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200
                        flex items-center gap-2
                      `}
                    >
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      {loading ? "Processing..." : confirmText}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
