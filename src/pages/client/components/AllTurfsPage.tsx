"use client"

import type React from "react"
import { useEffect, useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  AlertCircle,
  Grid,
  List,
  SlidersHorizontal,
  X,
  ArrowRight,
} from "lucide-react"
import { getTurfs } from "@/services/client/clientService"
import type { ITurffResponse } from "@/types/Response"
import type { ITurf } from "@/types/Turf"
import { useNavigate } from "react-router-dom"
import LocationSearch from "@/components/ReusableComponents/LocationSearch"

interface SelectedLocation {
  display_name: string
  lat: number
  lon: number
  city?: string
  address?: {
    city?: string
    town?: string
    village?: string
    state?: string
  }
}

const AllTurfsPage: React.FC = () => {
  const navigate = useNavigate()
  const [turfs, setTurfs] = useState<ITurf[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalTurfs, setTotalTurfs] = useState<number>(0)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null)
  const [cityFilter, setCityFilter] = useState<string>("")

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "price">("name")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [showFilters, setShowFilters] = useState(false)

  const pageSize = 12

  const extractCityFromLocation = (location: SelectedLocation): string => {
    if (location.city) return location.city

    if (location.address) {
      const cityName = location.address.city || location.address.town || location.address.village
      if (cityName) return cityName
    }

    const parts = location.display_name.split(",")
    return parts[0]?.trim() || ""
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchInput)
      if (searchInput !== debouncedSearchTerm) {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput, debouncedSearchTerm])

  useEffect(() => {
    if (selectedLocation) {
      const extractedCity = extractCityFromLocation(selectedLocation)
      setCityFilter(extractedCity)
      console.log("📍 Extracted city:", extractedCity)
    }
  }, [selectedLocation])

  const fetchAllTurfs = useCallback(async () => {
    try {
      if (initialLoading) {
        setInitialLoading(true)
      } else {
        setSearchLoading(true)
      }

      let searchQuery = debouncedSearchTerm

      if (selectedLocation && cityFilter) {
        searchQuery = cityFilter
      }

      const params = {
        page: currentPage,
        limit: pageSize,
        status: "approved",
        search: searchQuery,
      }

      console.log("🔍 Fetching turfs with params:", params)

      const response: ITurffResponse = await getTurfs(params)
      console.log("✅ API response:", response)

      if (response.success) {
        setTurfs(response.turfs || [])
        setTotalPages(response.totalPages || 1)
        setTotalTurfs(response.turfs?.length || 0)
        setError(null)
      } else {
        setError(response.message || "Failed to fetch turfs.")
      }
    } catch (err) {
      console.error("❌ Error fetching turfs:", err)
      setError("An error occurred while fetching turfs. Please try again.")
    } finally {
      setInitialLoading(false)
      setSearchLoading(false)
    }
  }, [currentPage, debouncedSearchTerm, cityFilter, selectedLocation, initialLoading])

  useEffect(() => {
    console.log("✅ AllTurfsPage mounted")
  }, [])

  useEffect(() => {
    fetchAllTurfs()
  }, [fetchAllTurfs])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleViewDetails = (turfId: string) => {
    navigate(`/turfoverview/${turfId}`)
  }

  const handleLocationSelect = (location: {
    display_name: string
    lat: number
    lon: number
    address?: {
      city?: string
      town?: string
      village?: string
      state?: string
      country?: string
    }
  }) => {
    console.log("📌 Location selected:", location)

    const selectedWithCity: SelectedLocation = {
      display_name: location.display_name,
      lat: location.lat,
      lon: location.lon,
      address: location.address,
      city: location.address?.city || location.address?.town || location.address?.village,
    }

    setSelectedLocation(selectedWithCity)
    setSearchInput(location.display_name)
    setDebouncedSearchTerm(location.display_name)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    console.log("🔄 Resetting all filters")
    setPriceRange([0, 5000])
    setSearchInput("")
    setSortBy("name")
    setSelectedLocation(null)
    setCityFilter("")
    setDebouncedSearchTerm("")
    setCurrentPage(1)
  }

  const filteredAndSortedTurfs = useMemo(() => {
    return [...turfs]
      .filter((turf) => {
        const price = turf.pricePerHour || 0
        return price >= priceRange[0] && price <= priceRange[1]
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.turfName.localeCompare(b.turfName)
          case "price":
            return (a.pricePerHour || 0) - (b.pricePerHour || 0)
          default:
            return 0
        }
      })
  }, [turfs, priceRange, sortBy])

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading All Turfs</h2>
          <p className="text-gray-600">Discovering amazing venues for you...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchAllTurfs()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">All Available Turfs</h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover {totalTurfs} premium football turfs ready for booking
              {selectedLocation && cityFilter && (
                <span className="block text-emerald-600 font-semibold mt-2">📍 in {cityFilter}</span>
              )}
            </p>

            {/* Unified Search Bar with Location Auto-Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 group-hover:border-emerald-200 transition-colors duration-300">
                  {/* LocationSearch Integrated Here */}
                  <LocationSearch
                    onSelect={handleLocationSelect}
                    placeholder="Search by location to find turfs..."
                    value={searchInput}
                    onChange={setSearchInput}
                  />
                  {/* Search Loading Spinner */}
                  {(searchInput !== debouncedSearchTerm || searchLoading) && (
                    <div className="absolute right-32 top-1/2 transform -translate-y-1/2 z-10">
                      <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    </div>
                  )}
                  {/* Search Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 z-10"
                    onClick={() => {
                      setDebouncedSearchTerm(searchInput)
                      setCurrentPage(1)
                    }}
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              {selectedLocation && cityFilter && (
                <p className="text-sm text-emerald-600 mt-3 text-center font-medium">
                  ✅ Showing turfs in {cityFilter}
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Results Info */}
            <div className="flex items-center gap-4">
              <div className="text-gray-900">
                <span className="font-semibold text-emerald-600">{filteredAndSortedTurfs.length}</span> turfs found
                {selectedLocation && cityFilter && <span className="text-gray-600 ml-1">in {cityFilter}</span>}
              </div>
              {totalPages > 1 && (
                <>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Filters Button */}
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                  showFilters
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-emerald-200 hover:text-emerald-700"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </motion.button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "price")}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <motion.button
                  onClick={() => setViewMode("grid")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "grid" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("list")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "list" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Collapsible Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <motion.button
                    onClick={() => setShowFilters(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (₹/hour)</label>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {[500, 1000, 2000, 3000].map((price) => (
                          <motion.button
                            key={price}
                            onClick={() => setPriceRange([0, price])}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-3 py-1 text-sm bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-full border border-gray-200 hover:border-emerald-200 transition-colors duration-200"
                          >
                            ≤₹{price}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="md:col-span-2 flex items-end gap-3">
                    <motion.button
                      onClick={resetFilters}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Reset Filters
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {searchLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                <span className="text-gray-700 font-medium">Searching turfs...</span>
              </div>
            </div>
          )}

          {/* Turfs Grid/List */}
          {filteredAndSortedTurfs.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No turfs found</h3>
              <p className="text-gray-600 text-lg mb-6">
                {selectedLocation && cityFilter
                  ? `No turfs available in ${cityFilter}. Try searching in a different location.`
                  : "Try adjusting your search terms or filters"}
              </p>
              {selectedLocation && (
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredAndSortedTurfs.map((turf, index) => (
                <motion.div
                  key={turf._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className={`group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer ${
                    viewMode === "list" ? "flex gap-4 p-4" : ""
                  }`}
                  onClick={() => handleViewDetails(turf._id)}
                >
                  {/* Image Container */}
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list" ? "w-48 h-32 rounded-lg flex-shrink-0" : "rounded-t-xl"
                    }`}
                  >
                    <img
                      src={
                        turf.images && turf.images.length > 0
                          ? turf.images[0]
                          : "/placeholder.svg?height=200&width=300&query=football turf field"
                      }
                      alt={turf.turfName}
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                        viewMode === "list" ? "w-full h-full" : "w-full h-48"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
                        Available
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${viewMode === "list" ? "flex-1" : "p-4"}`}>
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight mb-1">
                        {turf.turfName}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>{turf.location?.address ?? "Location Available"}</span>
                      </div>
                    </div>

                    {/* Price and Book Button */}
                    <div className={`flex items-center justify-between ${viewMode === "list" ? "mt-auto" : ""}`}>
                      <div>
                        <span className="text-xl font-bold text-emerald-600">₹{turf.pricePerHour ?? 0}</span>
                        <span className="text-gray-600 text-sm">/hour</span>
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetails(turf._id)
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center mt-12 gap-2"
          >
            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:border-emerald-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </motion.button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-200 hover:text-emerald-600 shadow-sm hover:shadow-md"
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:border-emerald-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AllTurfsPage
