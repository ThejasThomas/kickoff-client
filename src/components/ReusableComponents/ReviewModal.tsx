import type { ITurf } from "@/types/Turf";
import { useState } from "react";

interface AddReviewModalProps {
  turf: ITurf;
  bookingId: string;
  onClose: () => void;
  onSubmit: (data: {
    comment: string;
  }) => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  turf,
  onClose,
  onSubmit,
}) => {
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-2">
          Review {turf.turfName}
        </h2>
       
         
        {/* Comment */}
        <label className="block text-sm font-medium mt-4">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full mt-1 rounded-lg border p-2"
          placeholder="Share your experience..."
        />

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit({  comment })}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
