import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addRating,
  addReview,
  getpastbookings,
  getTurfById,
} from "@/services/client/clientService";
import type { IBookings } from "@/types/Booking_type";
import type { IBookResponse } from "@/types/Response";
import { useToaster } from "@/hooks/ui/useToaster";
import { AnimatePresence } from "framer-motion";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { PageHeader } from "@/components/ui/image-header";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { BookingCard } from "@/components/ui/booking-cardd";
import type { ITurf } from "@/types/Turf";
import AddReviewModal from "@/components/ReusableComponents/ReviewModal";
import { Download } from "lucide-react";
import AddRatingModal from "@/components/modals/addRatingModal";

const ClientPastBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<IBookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<IBookings | null>(
    null
  );
  const { successToast, errorToast } = useToaster();
  const [selectedTurf, setSelectedTurf] = useState<ITurf | null>(null);

  const LIMIT = 3;
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: IBookResponse = await getpastbookings(page, LIMIT);
      console.log("response", response);
      if (response.success) {
        const pastBookings = response.bookings.map((booking) => ({
          ...booking,
          status: "completed" as const,
        }));
        setBookings(pastBookings);
        setTotalPages(response.totalPages || 1);
        console.log("Past Bookings:", pastBookings);
      } else {
        setError(response.message);
        errorToast(response.message);
      }
    } catch (err) {
      setError("Failed to fetch past bookings");
      errorToast("Failed to fetch past bookings");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const handleAddReview = async (booking: IBookings) => {
    try {
      const turf = await getTurfById(booking.turfId);
      setSelectedTurf(turf);
      setSelectedBooking(booking);
    } catch (err) {
      console.log(err);
      errorToast("Failed to load turf details");
    }
  };
  const handleAddRating = (booking: IBookings) => {
    setSelectedBooking(booking);
    setShowRatingModal(true);
  };

  const handleDownloadReport = () => {
    if (bookings.length === 0) {
      errorToast("No bookings to download");
      return;
    }
    const reportData = {
      type: "bookings" as const,
      date: new Date().toLocaleDateString(),
      invoiceNumber: `USER-REPORT-${Date.now().toString().slice(-6)}`,
      bookings,
    };
    const encodedData = encodeURIComponent(JSON.stringify(reportData));
    navigate(`/invoiceuserbookings?data=${encodedData}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
        {/* Background Pattern */}
<div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            <LoadingSkeleton type="header" />
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
<div className="absolute inset-0 opacity-5 pointer-events-none">
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
              badge="Your History"
              title="Past Bookings"
              description="View your completed turf reservations"
            />
            <ErrorState
              title="Unable to Load Past Bookings"
              message={error}
              onRetry={fetchBookings}
              loading={loading}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Background Pattern */}
<div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <PageHeader
              badge="Your History"
              title="Past Bookings"
              description="View your completed turf reservations"
            />
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
          {bookings.length === 0 ? (
            <EmptyState
              title="No past bookings"
              description="You don't have any completed turf reservations. Book a turf to get started!"
              actionLabel="Book a Turf"
              onAction={() => navigate("/allturfdisplay")}
            />
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {bookings.map((booking, index) => (
                  <BookingCard
                    key={index}
                    booking={booking}
                    index={index}
                    onAddReview={handleAddReview}
                    onAddRating={handleAddRating}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>

              <span className="px-4 py-2 font-medium">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {selectedBooking && selectedTurf && (
        <AddReviewModal
          turf={selectedTurf}
          bookingId={selectedBooking._id}
          onClose={() => {
            setSelectedBooking(null);
            setSelectedTurf(null);
          }}
          onSubmit={async (data) => {
            try {
              await addReview({
                bookingId: selectedBooking._id,
                turfId: selectedBooking.turfId,
                comment: data.comment,
              });
              successToast("Review submitted successfully");
              fetchBookings();
            } catch (err) {
              errorToast("Failed to submit review");
            } finally {
              setSelectedBooking(null);
              setSelectedTurf(null);
            }
          }}
        />
      )}
      {showRatingModal && selectedBooking && (
        <AddRatingModal
          open={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedBooking(null);
          }}
          onSubmit={async (rating) => {
            try {
              await addRating({
                bookingId: selectedBooking._id,
                turfId: selectedBooking.turfId,
                rating,
              });

              successToast("Rating submitted successfully ⭐");
              fetchBookings();
            } catch {
              errorToast("Failed to submit rating");
            } finally {
              setShowRatingModal(false);
              setSelectedBooking(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default ClientPastBookingsPage;
