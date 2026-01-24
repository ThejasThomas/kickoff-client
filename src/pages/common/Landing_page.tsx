"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  MapPin,
  AlertCircle,
  Loader2,
  ChevronRight,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  Grid3X3,
  CheckCircle,
} from "lucide-react"
import { useGeolocation } from "@/hooks/common/useGeoLocation"
import { getTurfsByLocation } from "@/services/client/clientService"
import { useToaster } from "@/hooks/ui/useToaster"
import type { ITurf } from "@/types/Turf"
import type { ITurffResponse } from "@/types/Response"
import { useNavigate } from "react-router-dom"
import TurfCard from "../client/components/TurfCard"
import LocationModal from "../client/components/LocationModal"

const LandingPage: React.FC = () => {
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [turfs, setTurfs] = useState<ITurf[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { successToast, errorToast } = useToaster()
  const navigate = useNavigate()
  const { latitude, longitude, error, loading: locationLoading, getCurrentPosition } = useGeolocation()

  useEffect(() => {
    const hasShownLocationModal = localStorage.getItem("hasShownLocationModal")
    if (!hasShownLocationModal) {
      setShowLocationModal(true)
      localStorage.setItem("hasShownLocationModal", "true")
    }
  }, [])

  useEffect(() => {
    if (turfs.length > 0) {
      localStorage.setItem("turfs", JSON.stringify(turfs))
    }
  }, [turfs])

  useEffect(() => {
    const storedTurfs = localStorage.getItem("turfs")
    if (storedTurfs) {
      setTurfs(JSON.parse(storedTurfs))
    }
  }, [])

  useEffect(() => {
    if (latitude && longitude) {
      fetchNearbyTurfs({
        onSuccess: (data) => {
          successToast("Nearby turfs loaded successfully")
          setTurfs(data.turfs)
          setShowLocationModal(false)
        },
        onError: (error) => {
          // If auth error (e.g., 401), redirect to login; otherwise show toast
          if (error.response?.status === 401 || error.response?.status === 403) {
            navigate("/")
          } else {
            errorToast(error.response?.data?.message || "Failed to fetch the nearby turfs")
          }
        },
      })
    }
  }, [latitude, longitude])

  const fetchNearbyTurfs = async ({
    onSuccess,
    onError,
  }: {
    onSuccess: (data: ITurffResponse) => void
    onError: (error: any) => void
  }) => {
    if (!latitude || !longitude) return

    setLoading(true)
    try {
      const response = await getTurfsByLocation(latitude, longitude, {
        search: searchQuery,
        page: 1,
        limit: 10,
      })
      console.log("turfff", response)
      onSuccess(response)
    } catch (err: any) {
      console.error("Error fetching turfs:", err)
      onError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (turfId: string) => {
    navigate("/")
  }

  const handleLocationAccess = () => {
    getCurrentPosition()
  }

  const filteredTurfs = turfs.filter((turf) => {
    const matchesSearch =
      turf.turfName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      turf.location.city.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Brand Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-emerald-100"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              KICKOFF ARENA
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-emerald-600">Football Turf</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Discover premium football turfs near you. Book instantly and play with confidence.
              </p>
            </motion.div>

            {/* Modern Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 group-hover:border-emerald-200 transition-colors duration-300">
                  <div className="flex items-center">
                    <Search className="absolute left-6 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search turfs by name or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-32 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="absolute right-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      Search
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Location Status */}
            {latitude && longitude && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-2 text-gray-600 mb-12"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-medium">Showing turfs near your location</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
            >
              {[
                { icon: Shield, label: "Verified Turfs", desc: "Quality Assured" },
                { icon: Clock, label: "24/7 Booking", desc: "Always Available" },
                { icon: CheckCircle, label: "Instant Booking", desc: "Quick & Easy" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{feature.label}</div>
                  <div className="text-sm text-gray-600">{feature.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 border-y border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex items-center justify-center"> {/* Center horizontally */}
      <motion.button
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
      >
        View All Turfs
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  </div>
</div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        {!loading && filteredTurfs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Nearby Turfs</h2>
                <p className="text-gray-600">{filteredTurfs.length} premium venues found near you</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-2 bg-white rounded-lg border border-gray-200 hover:border-emerald-200 text-gray-700 hover:text-emerald-700 transition-colors duration-200"
                >
                  <Grid3X3 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Finding Perfect Turfs</h3>
                <p className="text-gray-600">Discovering amazing venues near you...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Location Access Required</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We need your location to show nearby football turfs. Please enable location access to continue.
              </p>
              <motion.button
                onClick={() => setShowLocationModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Enable Location Access
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Turfs Grid */}
        <AnimatePresence>
          {!loading && filteredTurfs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTurfs.map((turf, index) => (
                <motion.div
                  key={turf._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <TurfCard turf={turf} onSelect={handleViewDetails} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        <AnimatePresence>
          {!loading && filteredTurfs.length === 0 && turfs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Turfs Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search criteria or check back later for new venues.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show More Section */}
        {!loading && filteredTurfs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12 pt-8 border-t border-gray-200"
          >
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-medium transition-colors duration-200"
            >
              <Zap className="w-5 h-5" />
              Explore All Turfs
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationAccess={handleLocationAccess}
        loading={locationLoading}
        error={error}
      />
    </div>
  )
}

export default LandingPage