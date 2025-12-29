import { useState } from "react";
import { Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddRatingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const AddRatingModal = ({ open, onClose, onSubmit }: AddRatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl w-full max-w-md p-6 relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X />
          </button>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Rate your experience
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Select a star rating from 1 to 5
          </p>

          {/* ⭐ Stars */}
          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={36}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition
                  ${
                    (hovered || rating) >= star
                      ? "fill-emerald-500 text-emerald-500"
                      : "text-gray-300"
                  }
                `}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-medium"
            >
              Cancel
            </button>
            <button
              disabled={rating === 0}
              onClick={() => onSubmit(rating)}
              className={`flex-1 py-2 rounded-lg font-medium text-white
                ${
                  rating === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }
              `}
            >
              Submit
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddRatingModal;
