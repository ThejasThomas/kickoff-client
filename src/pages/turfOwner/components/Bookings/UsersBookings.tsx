import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  CreditCard,
  AlertCircle,
  X,
} from "lucide-react";
import type { IBookings } from "@/types/Booking_type";
import type { IBookResponse } from "@/types/Response";
import { useGetUsersBookings } from "@/hooks/turfOwner/getBookings";
import type { IClient } from "@/types/User";
import {
  getbookedUsersDetails,
  getHostedGamesByIdOwner,
} from "@/services/TurfOwner/turfOwnerService";
import toast from "react-hot-toast";

const BookingsPage: React.FC = () => {
  const { turfId } = useParams<{ turfId: string }>();
  const navigate = useNavigate();
  const [bookingsData, setBookingsData] = useState<IBookings[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [userCache, setUserCache] = useState<Record<string, IClient>>({});

  // New states for user details modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<IClient | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [showHostedGameModal, setShowHostedGameModal] = useState(false);
  const [selectedHostedGame, setSelectedHostedGame] = useState<any | null>(
    null
  );
  const [hostedGameLoading, setHostedGameLoading] = useState(false);

  const { mutate: getBookings } = useGetUsersBookings();

  useEffect(() => {
    if (!turfId) {
      setError("Invalid turf ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    getBookings(
      { turfId, date: selectedDate },
      {
        onSuccess: (data: IBookResponse) => {
          setBookingsData(data.bookings || []);
          setIsLoading(false);
        },
        onError: (error: any) => {
          setError(error.message || "Failed to fetch bookings");
          setIsLoading(false);
        },
      }
    );
  }, [turfId, selectedDate, getBookings]);

  useEffect(() => {
    const loadMissingUsers = async () => {
      const missingUserIds = bookingsData
        .map((b) => b.userId)
        .filter((id): id is string => Boolean(id) && !userCache[id]);

      for (const userId of missingUserIds) {
        try {
          const user = await getbookedUsersDetails(userId);
          setUserCache((prev) => ({
            ...prev,
            [userId]: user,
          }));
        } catch (err) {
          console.error("Failed to load user", userId);
        }
      }
    };

    if (bookingsData.length) {
      loadMissingUsers();
    }
  }, [bookingsData]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleViewUserDetails = async (userId: string) => {
    if (!userId) return;
    setSelectedUserId(userId);
    setUserLoading(true);
    setUserError(null);
    setShowUserModal(true);
    try {
      const details = await getbookedUsersDetails(userId);
      setUserDetails(details);
    } catch (err: any) {
      setUserError(err.message || "Failed to fetch user details");
    } finally {
      setUserLoading(false);
    }
  };

  const closeModal = () => {
    setShowUserModal(false);
    setSelectedUserId(null);
    setUserDetails(null);
    setUserError(null);
  };
  const handleViewHostedGame = async (hostedGameId?: string) => {
    if (!hostedGameId) return;

    try {
      setHostedGameLoading(true);
      setShowHostedGameModal(true);

      const res = await getHostedGamesByIdOwner(hostedGameId);

      if (!res?.success || !res?.game) {
        toast.error("Hosted game not found");
        setShowHostedGameModal(false);
        return;
      }

      setSelectedHostedGame(res.game);
    } catch (err) {
      toast.error("Failed to load hosted game");
      setShowHostedGameModal(false);
    } finally {
      setHostedGameLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Bookings
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Bookings for Turf
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <span>Back to Turfs</span>
              </button>
            </div>
          </div>

          {bookingsData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Bookings Found
              </h3>
              <p className="text-gray-600">
                There are no bookings for this turf on {selectedDate}.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingsData.map((booking, index) => (
                      <tr
                        key={
                          booking._id ||
                          `${booking.userId}-${booking.date}-${booking.startTime}-${index}`
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            <button
                              onClick={() =>
                                handleViewUserDetails(booking.userId || "")
                              }
                              className="text-sm text-blue-600 hover:text-blue-900 font-medium underline"
                              disabled={!booking.userId}
                            >
                              {userCache[booking.userId!]?.fullName ||
                                "Loading..."}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              booking.bookingType === "hosted_game"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {booking.bookingType === "hosted_game"
                              ? "Hosted Game"
                              : "Normal"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-900">
                              {booking.date || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-900">{`${
                              booking.startTime || "N/A"
                            } - ${booking.endTime || "N/A"}`}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">
                              ₹{booking.price ?? "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              booking.status || "unknown"
                            )}`}
                          >
                            {booking.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-900">
                              {booking.bookingType === "hosted_game" && (
                                <button
                                  onClick={() =>
                                    handleViewHostedGame(booking.hostedGameId)
                                  }
                                  className="text-xs text-purple-600 underline ml-2"
                                >
                                  View Game
                                </button>
                              )}
                            </span>
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

      {/* User Details Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  User Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {userLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : userError ? (
                <div className="text-center py-4">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600">{userError}</p>
                </div>
              ) : userDetails ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {userDetails.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">
                      {userDetails.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900">
                      {userDetails.phoneNumber || "N/A"}
                    </p>
                  </div>
                  {/* Add more fields as per IClient type, e.g., address, etc. */}
                </div>
              ) : null}
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showHostedGameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Hosted Game Details
                </h2>
                <button
                  onClick={() => {
                    setShowHostedGameModal(false);
                    setSelectedHostedGame(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {hostedGameLoading ? (
                <p className="text-center text-gray-500">Loading game...</p>
              ) : selectedHostedGame ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Court Type</span>
                    <span>{selectedHostedGame.courtType}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Date</span>
                    <span>{selectedHostedGame.slotDate}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Time</span>
                    <span>
                      {selectedHostedGame.startTime} -{" "}
                      {selectedHostedGame.endTime}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Price / Player</span>
                    <span>₹{selectedHostedGame.pricePerPlayer}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Players</span>
                    <span>
                      {selectedHostedGame.players.length} /{" "}
                      {selectedHostedGame.capacity}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Status</span>
                    <span className="capitalize">
                      {selectedHostedGame.status}
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <h3 className="font-semibold mb-2">Joined Players</h3>

                    {selectedHostedGame.players.length === 0 ? (
                      <p className="text-sm text-gray-500">No players joined</p>
                    ) : (
                      selectedHostedGame.players.map(
                        (player: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between border rounded p-2 mb-2"
                          >
                            <div>
                              <p className="font-medium">
                                {player.user?.name || "Player"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {player.user?.phoneNumber || "No phone"}
                              </p>
                            </div>

                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                player.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {player.status.toUpperCase()}
                            </span>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500">Game not found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingsPage;
