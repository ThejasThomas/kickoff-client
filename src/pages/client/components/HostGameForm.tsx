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
      {/* Slot Selection */}
<div>
  <label className="font-semibold text-lg">Select Game Slot</label>

  <div className="mt-3 max-h-96 overflow-y-auto pr-2 space-y-3">
    {slots
      .filter((s) => !s.isBooked)
      .map((slot) => {
        const isSelected = selectedSlotId === slot.id;

        return (
          <div
            key={slot.id}
            onClick={() => setSelectedSlotId(slot.id)}
            className={`
              group flex items-center justify-between p-4 rounded-xl border cursor-pointer
              transition-all duration-200
              ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border bg-background hover:border-primary/50 hover:shadow-sm"
              }
            `}
          >
            {/* Time Info */}
            <div className="flex flex-col">
              <span className="font-semibold text-base text-foreground">
                {slot.startTime} – {slot.endTime}
              </span>
              <span className="text-sm text-muted-foreground">
                Available slot
              </span>
            </div>

            {/* Right Indicator */}
            <div className="flex items-center gap-3">
              <span
                className={`
                  text-xs px-3 py-1 rounded-full
                  ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                  }
                `}
              >
                Select
              </span>

              {isSelected && (
                <CheckCircle className="w-5 h-5 text-primary" />
              )}
            </div>
          </div>
        );
      })}
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
