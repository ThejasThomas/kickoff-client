import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Clock,
  Calendar,
  Lock,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useToaster } from "@/hooks/ui/useToaster";
import { createGamePaymentSession, verifyGamePayment } from "@/services/client/clientService";

const HostGamePaymentPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [gameData, setGameData] = useState<any>(null);
  const [hasHandledStripe, setHasHandledStripe] = useState(false);

  const { successToast, errorToast } = useToaster();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (location.state?.hostGameData && !gameData) {
      setGameData(location.state.hostGameData);
    }
  }, [location.state, gameData]);

  useEffect(() => {
    const queryGameData = searchParams.get("gameData");
    if (queryGameData && !gameData) {
      try {
        const decoded = decodeURIComponent(queryGameData);
        const parsed = JSON.parse(decoded);
        setGameData(parsed);
      } catch (err) {
        console.error("Error parsing gameData from URL:", err);
        errorToast("Invalid game data");
      }
    }
  }, [searchParams, gameData]);

  useEffect(() => {
    if (!gameData || hasHandledStripe) return;
    if (status === "success" && sessionId) {
      setHasHandledStripe(true);
      handleStripeSuccess(sessionId);
      const timeout = setTimeout(() => {
        window.history.replaceState({}, "", window.location.pathname);
      }, 500);
      return () => clearTimeout(timeout);
    } else if (status === "cancelled") {
      setHasHandledStripe(true);
      errorToast("Payment cancelled.");
    }
  }, [status, sessionId, gameData, hasHandledStripe, errorToast]);

  const handleStripeSuccess = async (sessionId: string) => {
    try {
      setIsProcessing(true);
      const verifyJson = await verifyGamePayment(sessionId);
      if (!verifyJson.success) {
        throw new Error("Payment not confirmed");
      }
      successToast("Game Hosted Successfully 🎉");
      setShowSuccess(true);
      setIsProcessing(false);
      setTimeout(() => navigate("/hosted-games"), 2000);
    } catch (err: any) {
      errorToast(err.message || "Failed to host game");
      setIsProcessing(false);
    }
  };

  const handlePayWithStripe = async () => {
    if (!gameData) {
      errorToast("No game data available");
      return;
    }
    try {
      setIsProcessing(true);
      console.log('gamedata', gameData);
      const { url } = await createGamePaymentSession({
        amount: gameData.pricePerPlayer,
        gameData,
      });
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to create payment session");
      }
    } catch (err: any) {
      errorToast(err.message || "Payment setup failed");
      setIsProcessing(false);
    }
  };

  if (!gameData) {
    if (status === "success") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg font-semibold text-gray-600">Processing your payment... ⏳</p>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">No game data found. Redirecting...</p>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Hosted!</h2>
          <p className="text-gray-600 mb-6">Your game is live—invite players now!</p>
          <button
            onClick={() => navigate("/hosted-games")}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            View My Games
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} disabled={isProcessing}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Host Game Payment</h1>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Game Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <p className="text-gray-700">{gameData.location || "Turf Location"}</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <p className="text-gray-700">{gameData.slotDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <p className="text-gray-700">{gameData.startTime} - {gameData.endTime}</p>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-medium text-gray-800">Your Spot Cost</span>
              <span className="text-xl font-bold text-gray-900">₹{gameData.pricePerPlayer}</span>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <div className="mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayWithStripe}
            disabled={isProcessing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isProcessing ? "Setting up payment..." : "Pay & Host Game"}
            <Lock className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HostGamePaymentPage;