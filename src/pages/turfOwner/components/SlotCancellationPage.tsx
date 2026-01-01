import type React from "react"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { cancelSlot, checkSlotAvailability } from "@/services/TurfOwner/turfOwnerService"
import toast from "react-hot-toast"
import { Calendar, Clock, AlertCircle, CheckCircle, Users, DollarSign } from "lucide-react"

const SlotCancellationPage: React.FC = () => {
  const [params] = useSearchParams()
  const turfId = params.get("turfId") || ""

  const [date, setDate] = useState("")
  const [startHour, setStartHour] = useState("1")
  const [startPeriod, setStartPeriod] = useState("AM")
  const [endHour, setEndHour] = useState("2")
  const [endPeriod, setEndPeriod] = useState("AM")
  const [loading, setLoading] = useState(false)
  const [slotResult, setSlotResult] = useState<any>(null)

  const handleCheckSlot = async () => {
    if (!date || !startHour || !endHour) {
      toast.error("All fields required")
      return
    }

    const formattedStartTime = `${startHour} ${startPeriod}`
    const formattedEndTime = `${endHour} ${endPeriod}`

    try {
      setLoading(true)
      const res = await checkSlotAvailability(turfId, date, formattedStartTime, formattedEndTime)
      setSlotResult(res.result)
    } catch (err: any) {
      toast.error(err.message || "Failed to check slot")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSlot = async () => {
    if (!turfId || !date || !startHour || !startPeriod) {
      toast.error("Missing slot details")
      return
    }

    const formattedStartTime = `${startHour} ${startPeriod}`
    const formattedEndTime = `${endHour} ${endPeriod}`

    try {
      setLoading(true)
      const res = await cancelSlot({
        turfId,
        date,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      })
      toast.success(res.message || "Slot cancelled successfully ✅")
      setSlotResult(null)
    } catch (err: any) {
      toast.error(err.message || "Slot cancellation failed ❌")
    } finally {
      setLoading(false)
    }
  }

  const calculateEndTime = (hour: number, period: string) => {
    let newHour = hour + 1
    let newPeriod = period

    if (newHour === 12) {
      newPeriod = period === "AM" ? "PM" : "AM"
    }

    if (newHour > 12) {
      newHour = 1
    }

    return {
      hour: newHour.toString(),
      period: newPeriod,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Slot Cancellation</h1>
          <p className="text-slate-600">Manage and cancel turf booking slots</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="space-y-6">
            {/* Date Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Select Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Start Time</label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={startHour}
                  onChange={(e) => {
                    const selectedHour = Number(e.target.value)
                    setStartHour(e.target.value)
                    const next = calculateEndTime(selectedHour, startPeriod)
                    setEndHour(next.hour)
                    setEndPeriod(next.period)
                  }}
                  className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition duration-200"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <select
                  value={startPeriod}
                  onChange={(e) => {
                    const newPeriod = e.target.value
                    setStartPeriod(newPeriod)
                    const next = calculateEndTime(Number(startHour), newPeriod)
                    setEndHour(next.hour)
                    setEndPeriod(next.period)
                  }}
                  className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition duration-200"
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                End Time <span className="text-slate-500 text-xs font-normal">(Auto-calculated)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center text-slate-600 font-medium">
                  {endHour}
                </div>
                <div className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center text-slate-600 font-medium">
                  {endPeriod}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckSlot}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-xl disabled:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Checking Slot...
              </span>
            ) : (
              "Check Slot Availability"
            )}
          </button>

          {slotResult && (
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Slot Status</p>
                  <p className="text-lg font-bold text-slate-900">{slotResult.status}</p>
                </div>
              </div>

              {slotResult.status === "NORMAL_BOOKED" && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Booking Details</p>
                      <div className="mt-2 space-y-2 text-sm text-slate-700">
                        <p>
                          <span className="font-medium">User ID:</span> {slotResult.booking?.userId}
                        </p>
                        <p className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">Price:</span> ₹{slotResult.booking?.price}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span> {slotResult.booking?.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slotResult.status === "HOSTED_GAME" && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Hosted Game Details</p>
                      <div className="mt-2 space-y-2 text-sm text-slate-700">
                        <p>
                          <span className="font-medium">Host:</span> {slotResult.hostedGame?.hostUser?.name}
                        </p>
                        <p className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">Players:</span> {slotResult.hostedGame?.players?.length}
                        </p>
                        <p className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">Price / Player:</span> ₹{slotResult.hostedGame?.pricePerPlayer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slotResult.status === "BLOCKED" && (
                <div className="bg-red-50 rounded-xl p-4 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <p className="text-red-700 font-medium">This slot is already blocked and cannot be cancelled</p>
                </div>
              )}

              {slotResult.status === "AVAILABLE" && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <p className="text-amber-700 font-medium">This slot is available and will be marked as blocked</p>
                </div>
              )}

              {slotResult.status === "AVAILABLE" && (
                <button
                  onClick={handleCancelSlot}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-xl disabled:shadow-md"
                >
                  {loading ? "Processing..." : "Block Available Slot"}
                </button>
              )}

              {(slotResult.status === "NORMAL_BOOKED" || slotResult.status === "HOSTED_GAME") && (
                <button
                  onClick={handleCancelSlot}
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-xl disabled:shadow-md"
                >
                  {loading ? "Processing..." : "Cancel Slot & Issue Refund"}
                </button>
              )}
            </div>
          )}
        </div>

     
      </div>
    </div>
  )
}

export default SlotCancellationPage
