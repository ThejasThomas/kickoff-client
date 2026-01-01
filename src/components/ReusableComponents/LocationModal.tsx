import type { ITurf } from "@/types/Turf";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";

export const LocationModal = ({
  isOpen,
  onClose,
  location,
  turfName,
}: {
  isOpen: boolean;
  onClose: () => void;
  location: ITurf["location"] | null;
  turfName: string;
}) => {
  if (!isOpen || !location) return null;

  const { address, city, state, coordinates } = location;
  const [lng, lat] = coordinates.coordinates;

  const googleMapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {turfName} - Location
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
            >
              <XIcon size={20} />
            </button>
          </div>

          <div className="space-y-3 text-sm text-gray-300">
            <p>
              <span className="text-gray-400">Address:</span> {address}
            </p>
            <p>
              <span className="text-gray-400">City:</span> {city}
            </p>
            <p>
              <span className="text-gray-400">State:</span> {state || "N/A"}
            </p>
            <p>
              <span className="text-gray-400">Coordinates:</span>{" "}
              {lat}, {lng}
            </p>

            <a
              href={googleMapUrl}
              target="_blank"
              className="inline-block mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-xs"
            >
              Open in Google Maps
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
