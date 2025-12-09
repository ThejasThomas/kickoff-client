import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  cancelSlot,
  checkSlotAvailability,
} from "@/services/TurfOwner/turfOwnerService";
import toast from "react-hot-toast";

const SlotCancellationPage: React.FC = () => {
  const [params] = useSearchParams();
  const turfId = params.get("turfId") || "";

  const [date, setDate] = useState("");

  const [startHour, setStartHour] = useState("1");
  const [startPeriod, setStartPeriod] = useState("AM");

  const [endHour, setEndHour] = useState("2");
  const [endPeriod, setEndPeriod] = useState("AM");

  const [loading, setLoading] = useState(false);
  const [slotResult, setSlotResult] = useState<any>(null);

  const handleCheckSlot = async () => {
    if (!date || !startHour || !endHour) {
      toast.error("All fields required");
      return;
    }

    const formattedStartTime = `${startHour} ${startPeriod}`;
    const formattedEndTime = `${endHour} ${endPeriod}`;

    try {
      setLoading(true);

      const res = await checkSlotAvailability(
        turfId,
        date,
        formattedStartTime,
        formattedEndTime
      );

      setSlotResult(res.result);
    } catch (err: any) {
      toast.error(err.message || "Failed to check slot");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CANCEL SLOT PLACEHOLDER
  const handleCancelSlot = async () => {
    if (!turfId || !date || !startHour || !startPeriod) {
      toast.error("Missing slot details");
      return;
    }

    const formattedStartTime = `${startHour} ${startPeriod}`;
    const formattedEndTime = `${endHour} ${endPeriod}`;

    try {
      setLoading(true);

      const res = await cancelSlot({
        turfId,
        date,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      });

      toast.success(res.message || "Slot cancelled successfully ✅");

      // ✅ Clear UI after success
      setSlotResult(null);
    } catch (err: any) {
      toast.error(err.message || "Slot cancellation failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const calculateEndTime = (hour: number, period: string) => {
    let newHour = hour + 1;
    let newPeriod = period;

    if (newHour === 12) {
      newPeriod = period === "AM" ? "PM" : "AM";
    }

    if (newHour > 12) {
      newHour = 1;
    }

    return {
      hour: newHour.toString(),
      period: newPeriod,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Slot Cancellation
        </h2>

        {/* ✅ DATE */}
        <input
          type="date"
          className="w-full border p-2 rounded mb-4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* ✅ START TIME (HOUR + AM/PM) */}
        <div className="flex gap-3 mb-4">
          <select
            value={startHour}
            onChange={(e) => {
              const selectedHour = Number(e.target.value);
              setStartHour(e.target.value);

              const next = calculateEndTime(selectedHour, startPeriod);
              setEndHour(next.hour);
              setEndPeriod(next.period);
            }}
            className="w-1/2 border p-2 rounded"
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
              const newPeriod = e.target.value;
              setStartPeriod(newPeriod);

              const next = calculateEndTime(Number(startHour), newPeriod);
              setEndHour(next.hour);
              setEndPeriod(next.period);
            }}
            className="w-1/2 border p-2 rounded"
          >
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>

        <div className="flex gap-3 mb-6">
          <select
            value={endHour}
            disabled
            className="w-1/2 border p-2 rounded bg-gray-100 cursor-not-allowed"
          >
            <option>{endHour}</option>
          </select>

          <select
            value={endPeriod}
            disabled
            className="w-1/2 border p-2 rounded bg-gray-100 cursor-not-allowed"
          >
            <option>{endPeriod}</option>
          </select>
        </div>

        {/* ✅ CHECK BUTTON */}
        <button
          onClick={handleCheckSlot}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Checking..." : "Check Slot"}
        </button>

        {/* ✅ SLOT RESULT */}
        {slotResult && (
          <div className="mt-6 border p-4 rounded bg-gray-50">
            <p className="font-semibold mb-2">
              Slot Status:{" "}
              <span className="text-blue-600">{slotResult.status}</span>
            </p>

            {/* ✅ NORMAL BOOKING */}
            {slotResult.status === "NORMAL_BOOKED" && (
              <div className="text-sm space-y-1">
                <p>User ID: {slotResult.booking?.userId}</p>
                <p>Price: ₹{slotResult.booking?.price}</p>
                <p>Status: {slotResult.booking?.status}</p>
              </div>
            )}

            {/* ✅ HOSTED GAME */}
            {slotResult.status === "HOSTED_GAME" && (
              <div className="text-sm space-y-1">
                <p>Host: {slotResult.hostedGame?.hostUser?.name}</p>
                <p>Players: {slotResult.hostedGame?.players?.length}</p>
                <p>Price / Player: ₹{slotResult.hostedGame?.pricePerPlayer}</p>
              </div>
            )}

            {/* ✅ BLOCKED */}
            {slotResult.status === "BLOCKED" && (
              <p className="text-red-600 text-sm">
                This slot is already blocked
              </p>
            )}

            {/* ✅ AVAILABLE → CANCEL */}
            {slotResult.status === "AVAILABLE" && (
              <button
                onClick={handleCancelSlot}
                className="mt-4 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
              >
                Cancel Available Slot
              </button>
            )}

            {/* ✅ BOOKED → CANCEL + REFUND */}
            {(slotResult.status === "NORMAL_BOOKED" ||
              slotResult.status === "HOSTED_GAME") && (
              <button
                onClick={handleCancelSlot}
                className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Cancel Slot & Refund
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotCancellationPage;
