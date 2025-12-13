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

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [initialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();
  const { errorToast } = useToaster();
  const userId = useSelector((state: RootState) => state.client.client?.userId);

  // useEffect(() => {
  //   fetchHostedGames();
  // }, [page, search, minPrice, maxPrice]);
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

      if (res.success) {
        setGames(res.games || []);
      }
    } catch (err) {
      errorToast("Failed to load hosted games");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <motion.div
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!loading && games.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        No games found for selected filters
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by turf name or location..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border rounded-lg px-4 py-2 w-full md:w-1/2"
        />

        <input
          type="number"
          placeholder="Min Price"
          onChange={(e) => {
            setPage(1);
            setMinPrice(Number(e.target.value) || undefined);
          }}
          className="border rounded-lg px-4 py-2 w-full md:w-1/4"
        />

        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) => {
            setPage(1);
            setMaxPrice(Number(e.target.value) || undefined);
          }}
          className="border rounded-lg px-4 py-2 w-full md:w-1/4"
        />
      </div>

      <motion.div
        onClick={() => navigate("/home")}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden px-6 py-2 w-fit cursor-pointer 
             rounded-lg bg-slate-900 text-white font-medium 
             shadow-md hover:shadow-lg transition-all group"
      >
        <span className="relative z-10">Back To Home</span>

        <span
          className="absolute inset-0 bg-slate-700 translate-x-[-100%] 
               group-hover:translate-x-0 transition-transform duration-300"
        ></span>
      </motion.div>

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
                    navigate(`join-hosted-game/${game._id}`, {
                      state: { game },
                    })
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
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2 font-semibold">Page {page}</span>

        <button
          disabled={games.length < limit}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HostedGamesPage;
