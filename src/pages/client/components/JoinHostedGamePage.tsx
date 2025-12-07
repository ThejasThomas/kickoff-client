import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IndianRupee, MapPin, Clock, Users, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

import type { IHostedGameItem } from "@/types/host_game_type";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getHostedGamesById, joinHostedGame } from "@/services/client/clientService";
import JoinGameStripeModal from "@/components/Payments/JoinHostedGameStripeModal";


const JoinHostedGamePage = () => {

  
const [showStripe, setShowStripe] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);
const [hasHandledStripe, setHasHandledStripe] = useState(false);

  const [searchParams] = useSearchParams();
const status = searchParams.get("status");
const sessionId = searchParams.get("session_id");
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
const [game, setGame] = useState<IHostedGameItem | null>(
  location.state?.game || null
);
useEffect(() => {
  if (game) return;      
  if (!id) return;       

  const fetchGame = async () => {
    try {
      const res = await getHostedGamesById(id);

      if (!res?.success || !res?.game) {
        toast.error("Game not found");
        navigate("/hosted-games");
        return;
      }

      setGame(res.game);
    } catch (err) {
      toast.error("Failed to load game");
      navigate("/hosted-games");
    }
  };

  fetchGame();
}, [id, game, navigate]);


useEffect(() => {
  if (!game || hasHandledStripe) return;

  if (status === "success" && sessionId) {
    setHasHandledStripe(true);
    handleStripeSuccess();
    window.history.replaceState({}, "", window.location.pathname);
  }

  if (status === "cancelled") {
    toast("Payment cancelled");
    setHasHandledStripe(true);
  }
}, [status, sessionId, game]);

const handleStripeSuccess = async () => {
  if(!game)return
  try {
    setIsProcessing(true);

    const resp = await joinHostedGame(game._id);

    if (!resp.success) throw new Error(resp.message);

    toast("Joined Game Successfully ⚽");
    setIsProcessing(false);

    setTimeout(() => {
      navigate("/hosted-games");
    }, 2000);
  } catch (err: any) {
    toast(err.message || "Failed to join game");
    setIsProcessing(false);
  }
};


const userId = useSelector(
  (state: RootState) => state.client.client?.userId
);
console.log('iddd',userId)


  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Game not found. Please go back.
      </div>
    );
  }

const playersCount = game.players?.length || 0;
const isFull = playersCount >= game.capacity;

  const isHost = userId === game.hostUserId;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* ✅ HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Join Hosted Game</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-primary font-semibold"
        >
          ← Back
        </button>
      </div>

      {/* ✅ TURF IMAGE */}
     <img
  src={
    game.turf?.images?.[0] ||
    "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg"
  }
  alt="turf"
  onClick={() =>
    navigate(`/turfoverview/${game.turfId}`, {
      state: {
        from: `/hosted-games/join-hosted-game/${game._id}`,
        game // ✅ helps back navigation
      },
    })
  }
  className="w-full h-64 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
/>


      {/* ✅ GAME INFO */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">{game.turf?.turfName}</h2>

        <p className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          {game.turf?.location?.address}, {game.turf?.location?.city}
        </p>

        <p className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          {game.slotDate} • {game.startTime} - {game.endTime}
        </p>

        <p className="flex items-center gap-2 font-medium text-lg">
          <IndianRupee className="w-5 h-5" />
          {game.pricePerPlayer} / player
        </p>

        <p className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5" />
          {game.players.length} / {game.capacity} players joined
        </p>
      </div>

      {/* ✅ HOST DETAILS */}
      <div className="bg-white shadow rounded-xl p-6 space-y-3">
        <h3 className="font-semibold text-lg">Host Details</h3>

        <p className="font-medium flex items-center gap-2">
          {game.hostUser?.name}

          {isHost && (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              You
            </span>
          )}
        </p>

        <p className="flex items-center gap-2 text-gray-600 text-sm">
          <Mail className="w-4 h-4" />
          {game.hostUser?.email}
        </p>

        <p className="flex items-center gap-2 text-gray-600 text-sm">
          <Phone className="w-4 h-4" />
          {game.hostUser?.phoneNumber || "Not provided"}
        </p>
      </div>

      {/* ✅ PLAYERS LIST */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-3">{playersCount} / {game.capacity} players joined
</h3>

        {game.players.length === 0 ? (
          <p className="text-gray-500">No players joined yet</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {game.players.map((player, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{player.user?.name || "Player"}</p>
                  <p className="text-sm text-gray-500">
                    {player.user?.phoneNumber || "No phone"}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    player.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {player.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ JOIN & PAY BUTTON */}
      <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
  disabled={isFull || game.status !== "open" || isHost || isProcessing}
  onClick={() => setShowStripe(true)}
  className="w-full py-4 bg-primary text-white text-lg rounded-xl font-semibold disabled:bg-gray-300"
>
  {isHost
    ? "You Are the Host"
    : isFull
    ? "Game Full"
    : isProcessing
    ? "Processing..."
    : `Join & Pay ₹${game.pricePerPlayer}`}
</motion.button>

{showStripe && (
  <JoinGameStripeModal
    amount={game.pricePerPlayer}
    gameId={game._id}
    onError={(err) => {
      setShowStripe(false);
      toast(err.message);
    }}
  />
)}


    </div>
  );
};

export default JoinHostedGamePage;
