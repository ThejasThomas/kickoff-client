import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { getBookingDetails } from "@/services/client/clientService";
import type { IBookings } from "@/types/Booking_type";
import type { ITurf } from "@/types/Turf";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  CreditCard,
  Phone,
  ArrowLeft,
  Building,
  Users,
} from "lucide-react";
import { useToaster } from "@/hooks/ui/useToaster";
import { motion } from "framer-motion";

import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { PageHeader } from "@/components/ui/image-header";
import { InfoItem } from "@/components/ui/ui-info";
import { formatDate } from "@/components/ui/format-date";
import { formatTime } from "@/components/ui/format-date";

const BookingViewDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const turfId = searchParams.get("turfId");
  const [booking, setBooking] = useState<IBookings | null>(null);
  const [turfDetails, setTurfDetails] = useState<ITurf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { errorToast } = useToaster();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!turfId) {
        setError("No turf ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await getBookingDetails(turfId);
        if (response.success) {
          console.log(response);
          setTurfDetails(
            (response as any).turfDetails || (response as any).turf || null
          );
          const bookingData = location.state?.booking as IBookings | undefined;
          if (bookingData) {
            setBooking(bookingData);
          } else {
            setError("Booking details not available");
          }
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch turf details");
        errorToast("Failed to fetch turf details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [turfId]);

  if (loading) {
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
          <div className="max-w-6xl mx-auto">
            <LoadingSkeleton type="header" />
            <div className="grid gap-8 md:grid-cols-2">
              <LoadingSkeleton type="card" count={2} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking || !turfDetails) {
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
              badge="Booking Details"
              title="Booking Information"
              description="View your turf booking details and information"
            />
            <ErrorState
              title="Unable to Load Details"
              message={error || "No details available"}
              onRetry={() => navigate(-1)}
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
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6 flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bookings
          </motion.button>

          <PageHeader
            badge="Booking Details"
            title="Booking Information"
            description="Complete details of your turf reservation"
          />

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Turf Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1">
                <div className="bg-white rounded-t-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Turf Details
                      </h2>
                      <p className="text-sm text-gray-500">Venue Information</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <InfoItem
                  icon={Building}
                  label="Turf Name"
                  value={turfDetails.turfName}
                />

                <InfoItem
                  icon={MapPin}
                  label="Location"
                  value={`${turfDetails.location.address}, ${turfDetails.location.city}`}
                />

                <InfoItem
                  icon={Phone}
                  label="Contact Number"
                  value={turfDetails.contactNumber}
                />

                <InfoItem
                  icon={Users}
                  label="Court Type"
                  value={turfDetails.courtType}
                />
              </div>
            </motion.div>

            {/* Booking Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-1">
                <div className="bg-white rounded-t-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Booking Details
                      </h2>
                      <p className="text-sm text-gray-500">
                        Reservation Information
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <InfoItem
                  icon={Calendar}
                  label="Date"
                  value={formatDate(booking.date)}
                />

                <InfoItem
                  icon={Clock}
                  label="Time Slot"
                  value={`${formatTime(booking.startTime)} - ${formatTime(
                    booking.endTime
                  )}`}
                />

                <InfoItem
                  icon={DollarSign}
                  label="Total Amount"
                  value={
                    <span className="text-lg font-bold text-emerald-600">
                      ${booking.price}
                    </span>
                  }
                />

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-black-500 text-xs block">
                      Booking Status
                    </span>
                    <StatusBadge status={booking.status} variant="booking" />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-black-500 text-xs block">
                      Payment Status
                    </span>
                    <StatusBadge
                      status={booking.paymentStatus}
                      variant="payment"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1">
              <div className="bg-white rounded-t-xl p-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Booking Summary
                </h2>
                <p className="text-sm text-gray-500">
                  Complete overview of your reservation
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Venue</h3>
                    <p className="text-gray-700 font-medium">
                      {turfDetails.turfName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {turfDetails.location.address}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Schedule
                    </h3>
                    <p className="text-gray-700 font-medium">
                      {formatDate(booking.date)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {formatTime(booking.startTime)} -{" "}
                      {formatTime(booking.endTime)}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${booking.price}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <StatusBadge status={booking.status} variant="booking" />
                    <StatusBadge
                      status={booking.paymentStatus}
                      variant="payment"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingViewDetailsPage;
