import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Clock, User, AlertCircle, X, Plus, ArrowLeft, ChevronRight, Download } from "lucide-react"
import type { IBookings } from "@/types/Booking_type"
import type { IBookResponse } from "@/types/Response"
import { useGetUsersBookings } from "@/hooks/turfOwner/getBookings"
import type { IClient } from "@/types/User"
import { getbookedUsersDetails, getHostedGamesByIdOwner } from "@/services/TurfOwner/turfOwnerService"
import toast from "react-hot-toast"

const BookingsPage: React.FC = () => {
  const { turfId } = useParams<{ turfId: string }>()
  const navigate = useNavigate()
  const [bookingsData, setBookingsData] = useState<IBookings[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [userCache, setUserCache] = useState<Record<string, IClient>>({})

  // New states for user details modal
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [userDetails, setUserDetails] = useState<IClient | null>(null)
  const [userLoading, setUserLoading] = useState(false)
  const [userError, setUserError] = useState<string | null>(null)
  const [showHostedGameModal, setShowHostedGameModal] = useState(false)
  const [selectedHostedGame, setSelectedHostedGame] = useState<any | null>(null)
  const [hostedGameLoading, setHostedGameLoading] = useState(false)

  const { mutate: getBookings } = useGetUsersBookings()

  useEffect(() => {
    if (!turfId) {
      setError("Invalid turf ID")
      return
    }

    setIsLoading(true)
    setError(null)

    getBookings(
      { turfId, date: selectedDate },
      {
        onSuccess: (data: IBookResponse) => {
          setBookingsData(data.bookings || [])
          setIsLoading(false)
        },
        onError: (error: any) => {
          setError(error.message || "Failed to fetch bookings")
          setIsLoading(false)
        },
      },
    )
  }, [turfId, selectedDate, getBookings])

  useEffect(() => {
    const loadMissingUsers = async () => {
      const missingUserIds = bookingsData
        .map((b) => b.userId)
        .filter((id): id is string => Boolean(id) && !userCache[id])

      for (const userId of missingUserIds) {
        try {
          const user = await getbookedUsersDetails(userId)
          setUserCache((prev) => ({
            ...prev,
            [userId]: user,
          }))
        } catch (err) {
          console.error("Failed to load user", userId)
        }
      }
    }

    if (bookingsData.length) {
      loadMissingUsers()
    }
  }, [bookingsData])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  const handleViewUserDetails = async (userId: string) => {
    if (!userId) return
    setSelectedUserId(userId)
    setUserLoading(true)
    setUserError(null)
    setShowUserModal(true)
    try {
      const details = await getbookedUsersDetails(userId)
      setUserDetails(details)
    } catch (err: any) {
      setUserError(err.message || "Failed to fetch user details")
    } finally {
      setUserLoading(false)
    }
  }

  const closeModal = () => {
    setShowUserModal(false)
    setSelectedUserId(null)
    setUserDetails(null)
    setUserError(null)
  }
  const handleViewHostedGame = async (hostedGameId?: string) => {
    if (!hostedGameId) return

    try {
      setHostedGameLoading(true)
      setShowHostedGameModal(true)

      const res = await getHostedGamesByIdOwner(hostedGameId)

      if (!res?.success || !res?.game) {
        toast.error("Hosted game not found")
        setShowHostedGameModal(false)
        return
      }

      setSelectedHostedGame(res.game)
    } catch (err) {
      toast.error("Failed to load hosted game")
      setShowHostedGameModal(false)
    } finally {
      setHostedGameLoading(false)
    }
  }

  const handleDownloadReport = () => {
    if (bookingsData.length === 0) {
      toast.error("No bookings to download");
      return;
    }
    const enrichedBookings = bookingsData.map(booking => ({
      ...booking,
      userName: booking.userId && userCache[booking.userId] ? userCache[booking.userId].fullName : (booking.bookingType === "offline" ? "Walk-in Player" : "N/A"),
    }));
    const reportData = {
      type: "turf-bookings" as const,
      date: selectedDate,
      turfId,
      bookings: enrichedBookings,
      totalBookings: bookingsData.length,
      totalRevenue: bookingsData.reduce((sum, b) => sum + (b.price || 0), 0),
    };
    const encodedData = encodeURIComponent(JSON.stringify(reportData));
    navigate(`/turfOwner/invoice-owner-bookings?data=${encodedData}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="h-10 bg-slate-200 rounded-xl w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="space-y-3 p-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-slate-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Bookings</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto p-6 sm:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Bookings</h1>
                <p className="text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedDate}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 pointer-events-none" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all font-medium"
                  />
                </div>
                <button
                  onClick={() => navigate(`/turfOwner/add-offline-booking/${turfId}`)}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Booking</span>
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center gap-2 bg-slate-600 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {bookingsData.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
                <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Bookings Found</h3>
              <p className="text-slate-600 max-w-sm mx-auto">
                There are no bookings for this turf on <span className="font-semibold">{selectedDate}</span>. Start by
                adding a new booking.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookingsData.map((booking, index) => (
                      <tr
                        key={booking._id || `${booking.userId}-${booking.date}-${booking.startTime}-${index}`}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              {booking.bookingType === "offline" ? (
                                <span className="text-sm font-semibold text-amber-700">Walk-in Player</span>
                              ) : (
                                <button
                                  onClick={() => handleViewUserDetails(booking.userId || "")}
                                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                  disabled={!booking.userId}
                                >
                                  {userCache[booking.userId!]?.fullName || "Loading..."}
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {booking.date || "N/A"}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="w-4 h-4 text-slate-400" />
                              {booking.startTime || "N/A"} - {booking.endTime || "N/A"}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-slate-900">₹{booking.price ?? "N/A"}</span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${getStatusColor(
                              booking.status || "unknown",
                            )}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {booking.bookingType === "hosted_game" ? (
                              <button
                                onClick={() => handleViewHostedGame(booking.hostedGameId)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                              >
                                View Game
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                                  booking.paymentStatus === "completed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                {booking.paymentStatus === "completed" ? "Paid" : "Pending"}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                Player Details
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {userLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="h-3 bg-slate-200 rounded w-1/3 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : userError ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-red-600 font-medium">{userError}</p>
                </div>
              ) : userDetails ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Name
                    </label>
                    <p className="text-sm font-semibold text-slate-900">{userDetails.fullName || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <p className="text-sm text-slate-700">{userDetails.email || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <p className="text-sm text-slate-700">{userDetails.phoneNumber || "N/A"}</p>
                  </div>
                </div>
              ) : null}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={closeModal}
                  className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHostedGameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50">
              <h2 className="text-lg font-bold text-slate-900">Hosted Game Details</h2>
              <button
                onClick={() => {
                  setShowHostedGameModal(false)
                  setSelectedHostedGame(null)
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {hostedGameLoading ? (
                <p className="text-center text-slate-500 font-medium">Loading game details...</p>
              ) : selectedHostedGame ? (
                <div className="space-y-6">
                  {/* Game Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Court Type</p>
                      <p className="text-sm font-bold text-slate-900">{selectedHostedGame.courtType}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Date</p>
                      <p className="text-sm font-bold text-slate-900">{selectedHostedGame.slotDate}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Time</p>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedHostedGame.startTime} - {selectedHostedGame.endTime}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                        Price / Player
                      </p>
                      <p className="text-sm font-bold text-slate-900">₹{selectedHostedGame.pricePerPlayer}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Players</p>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedHostedGame.players.length} / {selectedHostedGame.capacity}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Status</p>
                      <p className="text-sm font-bold text-purple-600 capitalize">{selectedHostedGame.status}</p>
                    </div>
                  </div>

                  {/* Players List */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      Joined Players
                    </h3>

                    {selectedHostedGame.players.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No players joined yet</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedHostedGame.players.map((player: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                                <User className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{player.user?.name || "Player"}</p>
                                <p className="text-xs text-slate-500">{player.user?.phoneNumber || "No phone"}</p>
                              </div>
                            </div>

                            <span
                              className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                                player.status === "paid"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <p className="text-red-600 font-medium">Game details not found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BookingsPage