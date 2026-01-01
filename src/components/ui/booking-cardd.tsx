import { Calendar, Clock, DollarSign, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, formatTime } from "@/components/ui/format-date";
import type { IBookings } from "@/types/Booking_type";

interface BookingCardProps {
  booking: IBookings;
  index: number;
  onViewDetails?: (turfId: string, booking: IBookings) => void;
  onCancel?: (index: number, booking: IBookings) => void;
  onAddReview?: (booking: IBookings) => void;
  onAddRating?: (booking: IBookings) => void;
}

export const BookingCard = ({ booking, index, onViewDetails, onCancel,onAddReview,onAddRating }: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500 text-green-50";
      case "confirmed":
        return "bg-primary text-primary-foreground";
      case "pending":
        return "bg-yellow-500 text-yellow-50";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-primary text-primary-foreground";
      case "pending":
        return "bg-yellow-500 text-yellow-50";
      case "failed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Booking #{index + 1}</h3>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.status}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-gray-900 font-medium">{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-gray-900">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <DollarSign className="h-4 w-4 text-gray-600" />
            <span className="text-gray-900 font-semibold">${booking.price}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <CreditCard className="h-4 w-4 text-gray-600" />
            <span className={getPaymentStatusColor(booking.paymentStatus)}>
              {booking.paymentStatus}
            </span>
          </div>
        </div>
        {booking.status === "completed" && (
  <button 
    disabled={booking.hasReviewed}
    onClick={() => {
      if (!booking.hasReviewed) {
        onAddReview?.(booking);
      }
    }}
    className={`mt-4 w-full rounded-lg px-4 py-2 font-medium transition
      ${
        booking.hasReviewed
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }
    `}
  >
    {booking.hasReviewed ? "Reviewed" : "Add Review"}
  </button>
)}
{booking.status === "completed" && (
  <button
    disabled={booking.hasRated}
    onClick={() => {
      if (!booking.hasRated) {
        onAddRating?.(booking);
      }
    }}
    className={`mt-4 w-full rounded-lg px-4 py-2 font-medium transition
      ${
        booking.hasRated
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }
    `}
  >
    {booking.hasRated ? "Rated" : "Add Rating"}
  </button>
)}




        

        {onViewDetails && onCancel && (
          <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewDetails(booking.turfId, booking)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl font-semibold transition-all duration-200"
            >
              View Details
            </motion.button>
            {booking.status.toLowerCase() === "confirmed" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCancel(index, booking)}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};