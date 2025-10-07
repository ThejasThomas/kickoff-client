import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, X, Loader2, AlertCircle } from "lucide-react"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationAccess: () => void
  loading: boolean
  error: string | null
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onLocationAccess, loading, error }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-2xl p-8 max-w-md w-full shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">Enable Location</h2>
                  <p className="text-sm text-muted-foreground">Find turfs near you</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-muted-foreground leading-relaxed">
                We need access to your location to show you the best turf options nearby. Your location data is only
                used to find facilities close to you.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Location Access Failed</p>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg font-medium transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={onLocationAccess}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Allow Location
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                You can change this setting anytime in your browser preferences
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LocationModal
