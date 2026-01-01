import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  IndianRupee,
  XCircle
} from "lucide-react";
import { formatDate, formatTime } from "@/components/ui/format-date";
import type { HostedGameDTO } from "@/types/hostedGame_type";
import { isHostedGameCancellable } from "@/utils/helpers/IsCancellable";

interface HostedGameCardProps {
  game: HostedGameDTO;
  index: number;
  currentUserId: string;
  onCancelGame: (gameId: string) => void;
}

const HostedGameCard = ({
  game,
  index,
  currentUserId,
  onCancelGame,
}: HostedGameCardProps) => {
  const isHost = game.hostUserId === currentUserId;

  const canCancel =
    isHost &&
    game.status === "open" &&
    isHostedGameCancellable(game.slotDate, game.startTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border hover:shadow-xl transition"
    >
      <h3 className="font-semibold text-lg">{game.courtType}</h3>

      <div className="flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4" />
        {formatDate(game.slotDate)}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4" />
        {formatTime(game.startTime)} - {formatTime(game.endTime)}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Users className="w-4 h-4" />
        {game.players.length}/{game.capacity} Players
      </div>

      <div className="flex items-center gap-2 font-bold">
        <IndianRupee className="w-4 h-4" />
        {game.pricePerPlayer}
      </div>

      {/* 🔥 ACTION SECTION */}
      <div className="pt-4 border-t">
        {/* ✅ CANCEL BUTTON */}
        {canCancel && (
          <motion.button
            onClick={() => onCancelGame(game._id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2
              bg-gradient-to-r from-red-500 to-rose-500
              hover:from-red-600 hover:to-rose-600
              text-white py-2.5 rounded-xl font-semibold shadow"
          >
            <XCircle className="w-4 h-4" />
            Cancel Game
          </motion.button>
        )}

        {/* 🟡 PENDING CANCEL */}
        {game.status === "pending_cancel" && (
          <div className="w-full bg-yellow-100 text-yellow-700 py-2.5 rounded-xl font-semibold text-center">
            Cancellation Requested
          </div>
        )}

        {/* 🔴 CANCELLED */}
        {game.status === "cancelled" && (
          <div className="w-full bg-red-100 text-red-600 py-2.5 rounded-xl font-semibold text-center">
            Cancelled
          </div>
        )}

        {/* 🚫 FALLBACK */}
        {!canCancel &&
          game.status === "open" && (
            <div className="text-center text-sm text-gray-500">
              Cancellation not allowed
            </div>
          )}
      </div>
    </motion.div>
  );
};

export default HostedGameCard;
