import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import type { ITurf } from "@/types/Turf";
import type { ISlot } from "@/types/Slot";

interface HostGameFormProps {
  turf: ITurf;
  selectedDate: string;
  slots: ISlot[];
  onCancel: () => void;
  onSubmit: (data: {
    slotDate: string;
    startTime: string;
    endTime: string;
    courtType: string;
    pricePerPlayer: number;
    slotId: string;
  }) => void;
}

const playerCapacities: Record<string, number> = {
  "5x5": 10,
  "6x6": 12,
  "7x7": 14,
  "9x9": 18,
  "11x11": 22,
};

const HostGameForm: React.FC<HostGameFormProps> = ({
  turf,
  selectedDate,
  slots,
  onCancel,
  onSubmit,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [courtType, setCourtType] = useState<string>("");
  const [pricePerPlayer, setPricePerPlayer] = useState<number>(0);

  // allowed courts <= turf court
  const allowedCourts = ["5x5", "6x6", "7x7", "9x9", "11x11"].filter(
    (c) => Number(c.split("x")[0]) <= Number(turf.courtType.split("x")[0])
  );

  // 🔥 AUTO-CALCULATE PRICE PER PLAYER
  useEffect(() => {
    if (!selectedSlotId || !courtType) return;

    const slot = slots.find((s) => s.id === selectedSlotId);
    if (!slot) return;

    const maxPlayers = playerCapacities[courtType];
    if (!maxPlayers) return;

    const calculatedPrice = slot.price / maxPlayers;
    console.log('calculatedprice',calculatedPrice)

    setPricePerPlayer(Number(calculatedPrice.toFixed(2)));
  }, [selectedSlotId, courtType, slots]);

  const handleSubmit = () => {
    const slot = slots.find((s) => s.id === selectedSlotId);
    if (!slot) return;

    onSubmit({
      slotDate: selectedDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      courtType,
      pricePerPlayer,
      slotId: selectedSlotId,
    });
  };

  return (
    <div className="space-y-6">
      {/* Slot Selection */}
      <div>
        <label className="font-semibold">Select Game Slot</label>
        <div className="space-y-2 mt-2">
          {slots
            .filter((s) => !s.isBooked)
            .map((slot) => (
              <div
                key={slot.id}
                onClick={() => setSelectedSlotId(slot.id)}
                className={`p-4 border rounded-lg cursor-pointer flex justify-between ${
                  selectedSlotId === slot.id
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
              >
                <span>
                  {slot.startTime} - {slot.endTime}
                </span>
                {selectedSlotId === slot.id && (
                  <CheckCircle className="text-primary w-5 h-5" />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Court Type */}
      <div>
        <label className="font-semibold">Choose Court Type</label>
        <select
          value={courtType}
          onChange={(e) => setCourtType(e.target.value)}
          className="w-full border p-3 rounded-lg mt-2"
        >
          <option value="">Select...</option>
          {allowedCourts.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Price per Player (AUTO CALCULATED) */}
      <div>
        <label className="font-semibold">Price Per Player</label>
        <input
          type="number"
          value={pricePerPlayer}
          readOnly
          className="w-full border p-3 rounded-lg mt-2 bg-gray-100 cursor-not-allowed"
        />
        <p className="text-sm text-gray-500 mt-1">
          Auto-calculated: slot price ÷ total players
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 py-3 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={!selectedSlotId || !courtType}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default HostGameForm;
