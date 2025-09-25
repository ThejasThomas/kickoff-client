import { getupcomingBookings } from "@/services/client/clientService"
import type { IBookings } from "@/types/Booking_type"
import type { IBookResponse } from "@/types/Response"
import { useEffect, useState } from "react"
import { Calendar, Clock, DollarSign, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToaster } from "@/hooks/ui/useToaster"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { PageHeader } from "@/components/ui/image-header"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { BookingCard } from "@/components/ui/booking-card"
import { formatDate } from "@/components/ui/format-date"
import { formatTime } from "@/components/ui/format-date"


const CurrentBookingPage = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<IBookings[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelDialog, setCancelDialog] = useState<{
    isOpen: boolean
    bookingIndex: number | null
    booking: IBookings | null
  }>({
    isOpen: false,
    bookingIndex: null,
    booking: null,
  })
  const [cancelLoading, setCancelLoading] = useState(false)
  const { errorToast, successToast } = useToaster()

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response: IBookResponse = await getupcomingBookings()
      if (response.success) {
        setBookings(response.bookings)
        console.log("Bookings")
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError("Failed to fetch upcoming bookings")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (turfId: string, booking: IBookings) => {
    navigate(`/bookings/details?turfId=${turfId}`, {
      state: { booking },
    })
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancelBooking = async (bookingIndex: number, booking: IBookings) => {
    setCancelLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedBookings = [...bookings]
      updatedBookings[bookingIndex] = {
        ...booking,
        status: "cancelled",
      }
      setBookings(updatedBookings)
      successToast("Booking Cancelled")

      setCancelDialog({ isOpen: false, bookingIndex: null, booking: null })
    } catch (error) {
      errorToast("Cancellation Failed")
    } finally {
      setCancelLoading(false)
    }
  }

  const openCancelDialog = (bookingIndex: number, booking: IBookings) => {
    setCancelDialog({
      isOpen: true,
      bookingIndex,
      booking,
    })
  }

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
          <div className="max-w-7xl mx-auto">
            <LoadingSkeleton type="header" />
            <LoadingSkeleton type="card" count={6} />
          </div>
        </div>
      </div>
    )
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
            <ErrorState title="Unable to Load Bookings" message={error} onRetry={fetchBookings} loading={loading} />
          </div>
        </div>
      </div>
    )
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
            description="Manage your turf reservations and track your upcoming games"
          />

          {bookings.length === 0 ? (
            <EmptyState
              title="No upcoming bookings"
              description="You don't have any turf reservations scheduled yet. Ready to book your next game?"
              actionLabel="Book a Turf"
              onAction={() => navigate("/turfs")}
            />
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {bookings.map((booking, index) => (
                  <BookingCard
                    key={index}
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
      </div>

      {/* Enhanced Cancel Dialog */}
      <Dialog
        open={cancelDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCancelDialog({ isOpen: false, bookingIndex: null, booking: null })
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border-0 shadow-2xl">
          <DialogHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">Cancel Booking</DialogTitle>
            <DialogDescription className="text-gray-600 text-lg">
              Are you sure you want to cancel this turf booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {cancelDialog.booking && (
            <div className="py-6 space-y-4 border-y border-gray-100">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">{formatDate(cancelDialog.booking.date)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    {formatTime(cancelDialog.booking.startTime)} - {formatTime(cancelDialog.booking.endTime)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-600" />
                  <span className="font-bold text-gray-900 text-lg">${cancelDialog.booking.price}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3 pt-4">
            <motion.button
              onClick={() => setCancelDialog({ isOpen: false, bookingIndex: null, booking: null })}
              disabled={cancelLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
            >
              Keep Booking
            </motion.button>
            <motion.button
              onClick={() => {
                if (cancelDialog.bookingIndex !== null && cancelDialog.booking) {
                  handleCancelBooking(cancelDialog.bookingIndex, cancelDialog.booking)
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
  )
}

export default CurrentBookingPage
