import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Users,
  IndianRupee,
  Search,
  Filter,
} from "lucide-react";
import { getHostedGames } from "@/services/client/clientService";
import { useNavigate } from "react-router-dom";
import { useToaster } from "@/hooks/ui/useToaster";
import type { IHostedGameItem } from "@/types/host_game_type";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const HostedGamesPage = () => {
  const [games, setGames] = useState<IHostedGameItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [initialLoading, setInitialLoading] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { errorToast } = useToaster();
  const userId = useSelector((state: RootState) => state.client.client?.userId);

  useEffect(() => {
    const timer = setTimeout(fetchHostedGames, 400);
    return () => clearTimeout(timer);
  }, [page, search, minPrice, maxPrice]);

  const fetchHostedGames = async () => {
    try {
      setLoading(true);
      const res = await getHostedGames({
        page,
        limit,
        search,
        minPrice,
        maxPrice,
      });
      console.log("resssss", res);

      if (res.success) {
        setGames(res.games || []);
      }
    } catch (err) {
      console.log(err);
      errorToast("Failed to load hosted games");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <motion.button
            onClick={() => navigate("/home")}
            whileHover={{ scale: 1.02, x: -4 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6 px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg
                     shadow-md hover:shadow-lg hover:bg-slate-800 transition-all duration-200
                     flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </motion.button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Hosted Games
              </h1>
              <p className="text-slate-600">
                Find and join exciting games in your area
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">
              Search & Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="md:col-span-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by turf or location..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 outline-none
                         bg-slate-50 hover:bg-white"
              />
            </div>

            {/* Min Price Input */}
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type=""
                placeholder="Min Price"
                onChange={(e) => {
                  setPage(1);
                  setMinPrice(Number(e.target.value) || undefined);
                }}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 outline-none
                         bg-slate-50 hover:bg-white"
              />
            </div>

            {/* Max Price Input */}
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type=""
                placeholder="Max Price"
                onChange={(e) => {
                  setPage(1);
                  setMaxPrice(Number(e.target.value) || undefined);
                }}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 outline-none
                         bg-slate-50 hover:bg-white"
              />
            </div>
          </div>
        </motion.div>

        {initialLoading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1,
                ease: "linear",
              }}
              className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1,
                ease: "linear",
              }}
              className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-2xl shadow-lg border border-slate-200"
          >
            <div className="max-w-md mx-auto px-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No games found
              </h3>
              <p className="text-slate-600">
                Try adjusting your search filters to find more games
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Games Grid */}
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {games.map((game, index) => {
                  const joinedCount = game.players.filter(
                    (p) => p.status !== "cancelled"
                  ).length;

                  const isFull = joinedCount >= game.capacity;
                  const isHost = userId === game.hostUserId;

                  const isJoined = game.players.some(
                    (player) =>
                      player.userId === userId && player.status !== "cancelled"
                  );

                  const isParticipant = isHost || isJoined;

                  return (
                    <motion.div
                      key={game._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-xl overflow-hidden border border-slate-200
                               shadow-md hover:shadow-xl transition-all duration-300 group"
                    >
                      {/* Image with Overlay */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={
                            game.turf?.images?.[0] ||
                            "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg" ||
                            "/placeholder.svg"
                          }
                          alt={game.turf?.turfName}
                          className="w-full h-full object-cover transition-transform duration-500
                                   group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Status Badge */}
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm
        ${
          game.status === "open"
            ? "bg-green-500/90 text-white"
            : "bg-red-500/90 text-white"
        }`}
                          >
                            {game.status.toUpperCase()}
                          </span>

                          {isHost && (
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm bg-blue-600 text-white">
                              HOST
                            </span>
                          )}

                          {!isHost && isJoined && (
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm bg-yellow-500 text-white">
                              JOINED
                            </span>
                          )}
                        </div>

                        {/* Turf Name on Image */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h2 className="text-xl font-bold text-white drop-shadow-lg">
                            {game.turf?.turfName || "Football Game"}
                          </h2>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3">
                        {/* Location */}
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            {game.turf?.location?.city}
                          </span>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">
                            {game.slotDate} • {game.startTime} - {game.endTime}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center gap-1 text-green-700 bg-green-50 
                                        px-3 py-1.5 rounded-lg font-bold"
                          >
                            <IndianRupee className="w-4 h-4" />
                            <span>{game.pricePerPlayer}</span>
                            <span className="text-xs font-normal text-green-600">
                              /player
                            </span>
                          </div>
                        </div>

                        {/* Players Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                              <Users className="w-4 h-4" />
                              <span>
                                {joinedCount} / {game.capacity} players
                              </span>
                            </div>
                            <span className="text-slate-500">
                              {Math.round((joinedCount / game.capacity) * 100)}%
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  (joinedCount / game.capacity) * 100
                                }%`,
                              }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className={`h-full rounded-full ${
                                isFull
                                  ? "bg-red-500"
                                  : joinedCount / game.capacity > 0.7
                                  ? "bg-orange-500"
                                  : "bg-blue-600"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Action Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={
                            !isParticipant && (isFull || game.status !== "open")
                          }
                          onClick={() =>
                            navigate(`join-hosted-game/${game._id}`, {
                              state: { game },
                            })
                          }
                          className={`w-full mt-3 py-3 rounded-lg font-semibold transition-all
    duration-200 shadow-md hover:shadow-lg
    ${
      isParticipant
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
    }
    disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none
    disabled:text-slate-500`}
                        >
                          {isParticipant
                            ? "View Details"
                            : isFull
                            ? "Game Full"
                            : "Join Game"}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-6 py-2.5 bg-white border-2 border-slate-300 rounded-lg
                         font-medium text-slate-700 shadow-sm
                         hover:bg-slate-50 hover:border-slate-400 hover:shadow-md
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:bg-white disabled:hover:border-slate-300
                         transition-all duration-200"
              >
                Previous
              </motion.button>

              <div className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-md">
                Page {page}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={games.length < limit}
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2.5 bg-white border-2 border-slate-300 rounded-lg
                         font-medium text-slate-700 shadow-sm
                         hover:bg-slate-50 hover:border-slate-400 hover:shadow-md
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:bg-white disabled:hover:border-slate-300
                         transition-all duration-200"
              >
                Next
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HostedGamesPage;
