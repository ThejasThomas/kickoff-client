import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, IndianRupee } from "lucide-react";
import { getHostedGames } from "@/services/client/clientService";
import { useNavigate } from "react-router-dom";
import { useToaster } from "@/hooks/ui/useToaster";
import type { IHostedGameItem } from "@/types/host_game_type";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const HostedGamesPage = () => {
  const [games, setGames] = useState<IHostedGameItem[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { errorToast } = useToaster();
  const userId = useSelector((state: RootState) => state.client.client?.userId);

  useEffect(() => {
    fetchHostedGames();
  }, []);

  const fetchHostedGames = async () => {
    try {
      setLoading(true);
      const res = await getHostedGames();

      if (res.success) {
        setGames(res.games || []);
      }
    } catch (err) {
      errorToast("Failed to load hosted games");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        No hosted games available right now ⚽
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Hosted Games</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => {
          const joined = game.players.length;
          const isFull = joined >= game.capacity;
          const isHost = userId === game.hostUserId;

          return (
            <motion.div
              key={game._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow-lg rounded-xl overflow-hidden border"
            >
              {/* IMAGE */}
              <img
                src={
                  game.turf?.images?.[0] ||
                  "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg"
                }
                alt={game.turf?.turfName}
                className="h-44 w-full object-cover"
              />

              <div className="p-4 space-y-3">
                {/* TITLE */}
                <h2 className="text-lg font-semibold">
                  {game.turf?.turfName || "Football Game"}
                </h2>

                {/* LOCATION */}
                <p className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  {game.turf?.location?.city}
                </p>

                <p className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="w-4 h-4" />
                  {game.slotDate} • {game.startTime} - {game.endTime}
                </p>

                <p className="flex items-center gap-2 text-gray-800 font-medium">
                  <IndianRupee className="w-4 h-4" />
                  {game.pricePerPlayer} / player
                </p>

                {/*  PLAYERS */}
                <div className="flex justify-between items-center">
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4" />
                    {joined} / {game.capacity} players
                  </p>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      game.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {game.status.toUpperCase()}
                  </span>
                </div>

                <button
                  disabled={
                    (!isHost && isFull) || (!isHost && game.status !== "open")
                  }
                  onClick={() =>
                    navigate(
                      
                         `join-hosted-game/${game._id}`,
                      {
                        state: { game },
                      }
                    )
                  }
                  className={`w-full mt-2 py-2 rounded-lg text-white font-semibold transition
    ${
      isHost
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-primary hover:bg-primary/90"
    }
    disabled:bg-gray-300 disabled:cursor-not-allowed`}
                >
                  {isHost ? "View Details" : isFull ? "Game Full" : "Join Game"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HostedGamesPage;
