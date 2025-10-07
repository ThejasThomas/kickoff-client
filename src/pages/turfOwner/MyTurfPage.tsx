"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Search, Plus, MapPin, Phone, Clock, Users } from "lucide-react"
import { useGetMyTurf } from "@/hooks/turfOwner/getMyTurf"
import type { ITurffResponse } from "@/types/Response"
import type { ITurf } from "@/types/Turf"
import { useNavigate } from "react-router-dom"
import TurfDetails from "@/components/ReusableComponents/ViewTurfDetailedPage"

const MyTurfPage: React.FC = () => {
  type TurfStatus = "active" | "inactive" | "approved" | "rejected" | "pending" | "blocked"
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TurfStatus | "">("")
  const [searchInput, setSearchInput] = useState("")
  const [turfsData, setTurfsData] = useState<ITurffResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTurf, setSelectedTurf] = useState<ITurf | null>(null)
  const navigate = useNavigate()

  const { mutate: getMyTurfs, isPending } = useGetMyTurf()

  const fetchTurfs = () => {
    setIsLoading(true)
    setError(null)

    getMyTurfs(
      {
        page: currentPage,
        limit: 4,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      },
      {
        onSuccess: (data: ITurffResponse) => {
          setTurfsData(data)
          setIsLoading(false)
        },
        onError: (error: any) => {
          setError(error.message || "Failed to fetch turfs")
          setIsLoading(false)
        },
      },
    )
  }

  useEffect(() => {
    fetchTurfs()
  }, [currentPage, searchTerm, statusFilter])

  const handleSearch = () => {
    setSearchTerm(searchInput)
    setCurrentPage(1)
  }

  const handleStatusFilter = (status: TurfStatus) => {
    setStatusFilter(status === statusFilter ? "" : status)
    setCurrentPage(1)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      approved: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      blocked: "bg-zinc-100 text-zinc-800 border-zinc-200",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const loading = isLoading || isPending

  if (loading && !turfsData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !turfsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Turfs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchTurfs} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const turfs = turfsData?.turfs || []
  console.log("datasss", turfs)

  const totalPages = turfsData?.totalPages || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Turfs</h1>
            <p className="text-gray-600">Manage your turf listings</p>
          </div>
          <button
            onClick={() => navigate("/turfOwner/add-turf")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Turf</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  aria-label="Search by turf name"
                  placeholder="Search by turf name..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(["approved", "rejected", "pending", "blocked"] as TurfStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                disabled={loading}
                className={`px-4 py-2 rounded-full text-sm border shadow-sm transition-colors disabled:opacity-50 ${
                  statusFilter === status
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {(searchTerm || statusFilter) && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSearchInput("")
                  setStatusFilter("")
                  setCurrentPage(1)
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Loading overlay for filtering */}
        {loading && turfsData && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
            <p>Loading turfs...</p>
          </div>
        )}

        {/* Turfs Grid */}
        {turfs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Turfs Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter ? "Try adjusting your filters" : "Start by adding your first turf"}
            </p>
            <button
              onClick={() => navigate("/turf/add")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Turf</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {turfs.map((turf: ITurf) => (
                <div
                  key={turf._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Turf Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {turf.images && turf.images.length > 0 ? (
                      <img
                        src={turf.images[0] || "/placeholder.svg"}
                        alt={turf.turfName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <Users className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ring-1 ring-inset ${getStatusColor(
                          turf.status,
                        )}`}
                      >
                        {turf.status.charAt(0).toUpperCase() + turf.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  {/* Turf Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{turf.turfName}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{turf.description}</p>

                    {/* Location */}
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {turf.location.address}, {turf.location.city}
                      </span>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{turf.contactNumber}</span>
                    </div>

                    {/* Court Type & Price */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{turf.courtType}</span>
                      <div className="flex items-center text-green-600 font-semibold">
                        <Clock className="w-4 h-4 mr-1" />₹{turf.pricePerHour}
                        /hr
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => navigate(`/turfOwner/edit-turf/${turf._id}`)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setSelectedTurf(turf)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    className={`px-4 py-2 border rounded-lg disabled:opacity-50 ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal for Turf Details */}
        {selectedTurf && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <TurfDetails turf={selectedTurf} onClose={() => setSelectedTurf(null)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTurfPage
