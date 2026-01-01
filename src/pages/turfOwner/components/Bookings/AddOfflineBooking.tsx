"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, ArrowRight, X, Clock, Tag } from "lucide-react"
import { getSlots } from "@/services/TurfOwner/turfOwnerService"
import type { ISlot } from "@/types/Slot"
import toast from "react-hot-toast"
import { bookSlots } from "@/services/TurfOwner/turfOwnerService"

const AddOfflineBooking: React.FC = () => {
  const { turfId } = useParams<{ turfId: string }>()
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-CA"))
  const [slots, setSlots] = useState<ISlot[]>([])
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    if (!turfId || !selectedDate) return

    const fetchSlots = async () => {
      try {
        setLoading(true)
        const res = await getSlots(turfId, selectedDate)
        setSlots(Array.isArray(res) ? res : [])
      } catch (err) {
        console.log(err)
        toast.error("Failed to fetch slots")
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [turfId, selectedDate])

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlots((prev) => (prev.includes(slotId) ? prev.filter((id) => id !== slotId) : [...prev, slotId]))
  }

  const getTotalPrice = () => {
    return selectedSlots.reduce((total, id) => {
      const slot = slots.find((s) => s.id === id)
      return total + (slot?.price || 0)
    }, 0)
  }

  const handleOpenConfirm = () => {
    if (selectedSlots.length === 0) {
      toast.error("Select at least one slot")
      return
    }
    setShowConfirmModal(true)
  }

  const handleConfirmBooking = async () => {
    if (!turfId) return

    try {
      setConfirmLoading(true)

      const selectedSlotDetails = selectedSlots.map((id) => {
        const slot = slots.find((s) => s.id === id)
        return {
          startTime: slot?.startTime,
          endTime: slot?.endTime,
          price: slot?.price,
        }
      })

      const payload = {
        turfId,
        date: selectedDate,
        slots: selectedSlotDetails,
        totalAmount: getTotalPrice(),
        isOffline: true,
        paymentStatus: "pending",
        paymentMethod: "offline",
      }

      await bookSlots(payload)

      toast.success("Offline booking confirmed")
      navigate(`/turfOwner/bookings/${turfId}`)
    } catch (err: any) {
      toast.error(err?.message || "Failed to add booking")
    } finally {
      setConfirmLoading(false)
      setShowConfirmModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Add Offline Booking</h1>
          </div>
          <p className="text-slate-400 ml-15">Select your preferred date and time slots</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10">
          <label className="block mb-4 font-semibold text-white text-lg">Select Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin">
              <div className="w-8 h-8 border-2 border-slate-400 border-t-blue-500 rounded-full"></div>
            </div>
          </div>
        ) : slots.filter((slot) => !slot.isBooked).length > 0 ? (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Available Slots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slots
                .filter((slot) => !slot.isBooked)
                .map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot.id)}
                    className={`
                      group relative p-5 rounded-xl cursor-pointer transition-all duration-300 border-2
                      ${
                        selectedSlots.includes(slot.id)
                          ? "bg-gradient-to-br from-blue-600 to-emerald-600 border-blue-400 shadow-lg shadow-blue-500/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-300" />
                          <p
                            className={`font-bold text-lg ${selectedSlots.includes(slot.id) ? "text-white" : "text-white"}`}
                          >
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mt-3">
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              selectedSlots.includes(slot.id)
                                ? "bg-white/20 text-white"
                                : "bg-blue-500/20 text-blue-300"
                            }`}
                          >
                            {slot.duration} hr
                          </span>
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${
                              selectedSlots.includes(slot.id)
                                ? "bg-white/20 text-white"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            <Tag className="w-3.5 h-3.5" />₹{slot.price}
                          </span>
                        </div>
                      </div>
                      {selectedSlots.includes(slot.id) && (
                        <div className="flex-shrink-0 ml-3">
                          <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No available slots for the selected date</p>
          </div>
        )}

        {selectedSlots.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-white">₹{getTotalPrice()}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm mb-1">Selected Slots</p>
                <p className="text-2xl font-bold text-emerald-400">{selectedSlots.length}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleOpenConfirm}
          className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedSlots.length === 0}
        >
          <span>Book Selected Slots</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Confirm Your Booking</h2>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Date</p>
                    <p className="text-white font-semibold">{selectedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Selected Slots</p>
                    <p className="text-white font-semibold">
                      {selectedSlots.length} slot{selectedSlots.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-lg border border-blue-500/30">
                  <Tag className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Total Amount</p>
                    <p className="text-white font-bold text-lg">₹{getTotalPrice()}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <span className="font-semibold"></span> Payment will be Offline.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 bg-white/5 border-t border-white/10">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBooking}
                disabled={confirmLoading}
                className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {confirmLoading ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddOfflineBooking
