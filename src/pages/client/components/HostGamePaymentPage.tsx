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
import { hostGame } from "@/services/client/clientService";
import HostGameStripeModal from "@/components/Payments/HostGameStripeModal";

const HostGamePaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "">("");
  const [showStripe, setShowStripe] = useState(false);
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
  console.log(paymentMethod)

    console.log(isProcessing)

useEffect(() => {
  if (location.state?.hostGameData) {
    setGameData(location.state.hostGameData);
    localStorage.setItem("hostGameData", JSON.stringify(location.state.hostGameData));
  }
}, [location.state]);

useEffect(() => {
  if (!gameData) {
    const stored = localStorage.getItem("hostGameData");
    if (stored && stored !== "null") {
      setGameData(JSON.parse(stored));
    }
  }
}, [gameData]);

useEffect(() => {
  if (!gameData || hasHandledStripe) return;

  if (status === "success" && sessionId) {
    setHasHandledStripe(true);
    handleStripeSuccess(sessionId);
    window.history.replaceState({}, "", window.location.pathname);

  }

  if (status === "cancelled") {
    errorToast("Payment cancelled.");
    setHasHandledStripe(true);
  }
}, [status, sessionId, gameData]);




  const handleStripeSuccess = async (sessionId: string) => {
    try {
      setIsProcessing(true);

      const verifyResponse = await fetch(
        `${import.meta.env.VITE_PRIVATE_API_URL}/api/payment/verify-session/${sessionId}`
      );

      const verifyJson = await verifyResponse.json();
      if (!verifyJson.success) throw new Error("Payment verification failed");

      const payload = {
        turfId: gameData.turfId,
        courtType: gameData.courtType,
        slotDate: gameData.slotDate,
        startTime: gameData.startTime,
        endTime: gameData.endTime,
        pricePerPlayer: gameData.pricePerPlayer,
        slotId: gameData.slotId,
      };

      const resp = await hostGame(payload);
      if (!resp.success) throw new Error(resp.message);

      successToast("Game Hosted Successfully 🎉");
      setShowSuccess(true);
      setIsProcessing(false);

      setTimeout(() => navigate("/hosted-games"), 2000);
    } catch (err: any) {
      errorToast(err.message || "Failed to host game");
      setIsProcessing(false);
    }
  };

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">No game data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
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
              <p className="text-gray-700">{gameData.location}</p>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <p className="text-gray-700">{gameData.slotDate}</p>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <p className="text-gray-700">
                {gameData.startTime} - {gameData.endTime}
              </p>
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-medium text-gray-800">Amount to Pay</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{gameData.pricePerPlayer}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setPaymentMethod("stripe");
              setShowStripe(true);
            }}
            className="w-full bg-primary text-white py-4 rounded-lg flex items-center justify-center gap-2"
          >
            Pay with Stripe <Lock className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Stripe Modal */}
      {showStripe && (
        <HostGameStripeModal
          amount={gameData.pricePerPlayer}
          bookingData={gameData}
          onError={(err) => errorToast(err.message)}
        />
      )}

      {/* Success Screen */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Game Hosted Successfully!</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostGamePaymentPage;
