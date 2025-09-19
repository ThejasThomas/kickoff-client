
import { getTurfs } from "@/services/client/clientService"
import type { ITurffResponse } from "@/types/Response"
import type { ITurf } from "@/types/Turf"
import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  Target,
  Sparkles,
  Play,
  Trophy,
  Eye,
  Zap,
} from "lucide-react"

const ClientHomePage: React.FC = () => {
  const [turfs, setTurfs] = useState<ITurf[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")

  const pageSize = 10

  useEffect(() => {
    console.log("✅ ClientHomePage mounted")
  }, [])

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true)
        console.log("Fetching turfs with params:", { page: currentPage, limit: pageSize, status: "approved" })
        const response: ITurffResponse = await getTurfs({
          page: currentPage,
          limit: pageSize,
          status: "approved",
        })
        console.log("API response:", response)
        if (response.success) {
          setTurfs(response.turfs || [])
          setTotalPages(response.totalPages || 1)
          setCurrentPage(response.currentPage || 1)
        } else {
          setError(response.message || "Failed to fetch turfs.")
        }
      } catch (err) {
        console.error("Error fetching turfs:", err)
        setError("An error occurred while fetching turfs. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTurfs()
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const filteredTurfs = turfs.filter(
    (turf) =>
      turf.turfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turf.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-20 h-20 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Turfs</h2>
            <p className="text-green-200">Please wait...</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-red-400 text-lg">{error}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900">
      <div className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-emerald-900/40 to-green-900/60"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-300/5 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-30"
                initial={{
                  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
                  y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
                }}
                animate={{
                  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
                  y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
                }}
                transition={{
                  duration: Math.random() * 25 + 20,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-7xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
                KICKOFF
                <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  ARENA
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-green-100 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
                Book Premium Football Turfs Near You
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-3xl mx-auto relative mb-16"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                  <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-green-300 w-7 h-7" />
                  <input
                    type="text"
                    placeholder="Search turfs by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-20 pr-8 py-6 bg-transparent text-white placeholder-green-200 focus:outline-none text-xl font-medium"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg"
                  >
                    Search
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-12 text-green-100"
            >
              {[
                { icon: Shield, text: "Verified Turfs" },
                { icon: Target, text: "Easy Booking" },
                { icon: Sparkles, text: "Quality Assured" },
                { icon: Trophy, text: "Best Experience" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center group-hover:from-green-500/40 group-hover:to-emerald-500/40 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="font-semibold text-lg">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Available Turfs</h2>
          <p className="text-green-200 text-xl max-w-3xl mx-auto leading-relaxed">
            Find and book the perfect turf for your next game
          </p>
        </motion.div>

        {filteredTurfs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-40 h-40 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-20 h-20 text-green-400" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-4">No turfs found</h3>
            <p className="text-green-200 text-xl">Try adjusting your search terms</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredTurfs.map((turf, index) => (
              <motion.div
                key={turf._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden border border-white/10 hover:border-green-400/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative overflow-hidden rounded-t-3xl">
                  <img
                    src={
                      turf.images && turf.images.length > 0
                        ? turf.images[0]
                        : "/placeholder.svg?height=300&width=400&query=football turf field"
                    }
                    alt={turf.turfName}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <a href={`/turfoverview/${turf._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
                      >
                        <Eye className="w-6 h-6 text-white" />
                      </motion.button>
                    </a>
                  </div>

                  <div className="absolute top-6 left-6">
                    <span className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-black rounded-full shadow-xl backdrop-blur-sm border border-white/30 flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      AVAILABLE
                    </span>
                  </div>
                </div>

                <div className="relative p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors leading-tight mb-4">
                      {turf.turfName}
                    </h3>
                    <div className="flex items-center gap-3 text-green-200">
                      <MapPin className="w-6 h-6 text-green-400" />
                      <span className="font-medium">{turf.location?.address ?? "Location Available"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-4xl font-black text-green-400">₹{turf.pricePerHour ?? 0}</span>
                      <span className="text-green-200 text-lg font-medium">/hour</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center mt-20 gap-4"
          >
            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-green-400/40"
            >
              <ChevronLeft className="w-7 h-7 text-green-400" />
            </motion.button>

            <div className="flex items-center gap-3">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-16 rounded-2xl font-black transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl border border-green-400/40"
                        : "bg-white/10 backdrop-blur-sm text-green-400 hover:bg-white/20 shadow-xl hover:shadow-2xl border border-white/10 hover:border-green-400/40"
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                )
              })}
            </div>

            <motion.button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-green-400/40"
            >
              <ChevronRight className="w-7 h-7 text-green-400" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ClientHomePage