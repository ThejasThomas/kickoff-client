import { getupcomingBookings } from "@/services/client/clientService";
import type { IBookings } from "@/types/Booking_type";
import type { IBookResponse } from "@/types/Response";
import { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToaster } from "@/hooks/ui/useToaster";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { PageHeader } from "@/components/ui/image-header";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { BookingCard } from "@/components/ui/booking-card";
import { formatDate } from "@/components/ui/format-date";
import { formatTime } from "@/components/ui/format-date";

const CurrentBookingPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<IBookings[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [cancelDialog, setCancelDialog] = useState<{
    isOpen: boolean;
    bookingIndex: number | null;
    booking: IBookings | null;
  }>({
    isOpen: false,
    bookingIndex: null,
    booking: null,
  });
  const [cancelLoading, setCancelLoading] = useState(false);
  const { errorToast, successToast } = useToaster();

  const pageSize = 6;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchBookings = useCallback(async () => {
    try {
      if (initialLoading) {
        setInitialLoading(true);
      } else {
        setSearchLoading(true);
      }

      console.log("Fetching upcoming bookings with params:", {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchTerm,
      });

      const response: IBookResponse = await getupcomingBookings({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchTerm,
      });

      console.log("API response:", response);

      if (response.success) {
        setBookings(response.bookings || []);
        setTotalPages(response.totalPages || 1);
        setTotalBookings(response.total || 0);
        setError(null);
      } else {
        setError(response.message || "Failed to fetch bookings.");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("An error occurred while fetching bookings. Please try again.");
    } finally {
      setInitialLoading(false);
      setSearchLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, initialLoading]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleViewDetails = (turfId: string, booking: IBookings) => {
    navigate(`/bookings/details?turfId=${turfId}`, {
      state: { booking },
    });
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleCancelBooking = async (
    bookingIndex: number,
    booking: IBookings
  ) => {
    setCancelLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedBookings = [...bookings];
      updatedBookings[bookingIndex] = {
        ...booking,
        status: "cancelled",
      };
      setBookings(updatedBookings);
      successToast("Booking Cancelled");

      setCancelDialog({ isOpen: false, bookingIndex: null, booking: null });
    } catch (error) {
      errorToast("Cancellation Failed");
      console.log(error);
    } finally {
      setCancelLoading(false);
    }
  };

  const openCancelDialog = (bookingIndex: number, booking: IBookings) => {
    setCancelDialog({
      isOpen: true,
      bookingIndex,
      booking,
    });
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Loading Your Bookings
              </h2>
              <p className="text-gray-600">
                Fetching your upcoming reservations...
              </p>
            </div>
            <LoadingSkeleton type="card" count={6} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23dc2626' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 p-6">
          <div className="max-w-4xl mx-auto">
            <PageHeader
              badge="Your Bookings"
              title="Upcoming Bookings"
              description="Manage your turf reservations and track your upcoming games"
            />
            <ErrorState
              title="Unable to Load Bookings"
              message={error}
              onRetry={fetchBookings}
              loading={initialLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            badge="Your Active Reservations"
            title="Upcoming Bookings"
            description={`Manage your turf reservations and track your ${totalBookings} upcoming games`}
          />

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 group-hover:border-emerald-200 transition-colors duration-300">
                <div className="flex items-center">
                  <Search className="absolute left-6 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by turf name or location..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    className="w-full pl-14 pr-6 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg rounded-2xl"
                  />
                  {(searchInput !== debouncedSearchTerm || searchLoading) && (
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Info */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="text-gray-900">
              <span className="font-semibold text-emerald-600">
                {totalBookings}
              </span>{" "}
              bookings found
              {totalPages > 1 && (
                <>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="relative">
            {searchLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                  <span className="text-gray-700 font-medium">
                    Searching bookings...
                  </span>
                </div>
              </div>
            )}

            {bookings.length === 0 ? (
              <EmptyState
                title="No upcoming bookings"
                description="You don't have any turf reservations scheduled yet. Ready to book your next game?"
                actionLabel="Book a Turf"
                onAction={() => navigate("/allturfdisplay")}
              />
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {bookings.map((booking, index) => (
                    <BookingCard
                      key={booking._id || index}
                      booking={booking}
                      index={index}
                      onViewDetails={handleViewDetails}
                      onCancel={openCancelDialog}
                    />
                  ))}
                </AnimatePresence>
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
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
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
                  );
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

      {/* Enhanced Cancel Dialog */}
      <Dialog
        open={cancelDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCancelDialog({
              isOpen: false,
              bookingIndex: null,
              booking: null,
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border-0 shadow-2xl">
          <DialogHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Cancel Booking
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg">
              Are you sure you want to cancel this turf booking? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {cancelDialog.booking && (
            <div className="py-6 space-y-4 border-y border-gray-100">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    {formatDate(cancelDialog.booking.date)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    {formatTime(cancelDialog.booking.startTime)} -{" "}
                    {formatTime(cancelDialog.booking.endTime)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-600" />
                  <span className="font-bold text-gray-900 text-lg">
                    ₹{cancelDialog.booking.price}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3 pt-4">
            <motion.button
              onClick={() =>
                setCancelDialog({
                  isOpen: false,
                  bookingIndex: null,
                  booking: null,
                })
              }
              disabled={cancelLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
            >
              Keep Booking
            </motion.button>
            <motion.button
              onClick={() => {
                if (
                  cancelDialog.bookingIndex !== null &&
                  cancelDialog.booking
                ) {
                  handleCancelBooking(
                    cancelDialog.bookingIndex,
                    cancelDialog.booking
                  );
                }
              }}
              disabled={cancelLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:opacity-50"
            >
              {cancelLoading ? "Cancelling..." : "Cancel Booking"}
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurrentBookingPage;
