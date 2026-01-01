import { Calendar, Clock, DollarSign, CreditCard, Star } from "lucide-react";
import { motion } from "framer-motion";
import { StatusBadge } from "./status-badge";
import type { IBookings } from "@/types/Booking_type";
import { formatDate } from "@/components/ui/format-date";
import { formatTime } from "./format-date";
import { isCancellationAllowed } from "@/lib/utils";

interface BookingCardProps {
  booking: IBookings;
  index: number;
  onViewDetails: (turfId: string, booking: IBookings) => void;
  onCancel?: (index: number, booking: IBookings) => void;
}

export const BookingCard = ({
  booking,
  index,
  onViewDetails,
  onCancel,
}: BookingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300"
    >
      {/* Card Header with Gradient */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-1">
        <div className="bg-white rounded-t-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Turf Booking
                </h3>
                <p className="text-sm text-gray-500"></p>
              </div>
            </div>
            <StatusBadge status={booking.status} variant="booking" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 text-sm group-hover:text-emerald-600 transition-colors">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-4 w-4 text-gray-600" />
          </div>
          <span className="font-medium text-gray-900">
            {formatDate(booking.date)}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm group-hover:text-emerald-600 transition-colors">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Clock className="h-4 w-4 text-gray-600" />
          </div>
          <span className="font-medium text-gray-900">
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm group-hover:text-emerald-600 transition-colors">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-gray-600" />
          </div>
          <span className="font-bold text-gray-900 text-lg">
            ${booking.price}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-gray-600" />
          </div>
          <StatusBadge status={booking.paymentStatus} variant="payment" />
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            {/* View Details */}
            <motion.button
              onClick={() => onViewDetails(booking.turfId, booking)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
            >
              View Details
            </motion.button>

            {/* --- SHOW ONLY WHEN CONFIRMED --- */}
            {booking.status === "confirmed" &&
              onCancel &&
              isCancellationAllowed(booking.date, booking.startTime) && (
                <motion.button
                  onClick={() => onCancel(index, booking)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                >
                  Cancel
                </motion.button>
              )}

            {booking.status === "pending_cancel" && (
              <div className="flex-1 bg-yellow-100 text-yellow-700 py-3 px-4 rounded-xl font-semibold text-center">
                Cancellation Requested
              </div>
            )}

            {booking.status === "cancelled" && (
              <div className="flex-1 bg-red-100 text-red-600 py-3 px-4 rounded-xl font-semibold text-center">
                Cancelled
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
