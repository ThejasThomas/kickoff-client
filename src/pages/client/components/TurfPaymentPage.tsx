import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Clock,
  Calendar,
  Lock,
  CreditCard,
  Smartphone,
  Wallet,
  Globe,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { bookSlots } from "@/services/client/clientService";
import type { IBookings } from "@/types/Booking_type";
import { useToaster } from "@/hooks/ui/useToaster";
import StripeModal from "@/components/Payments/StripeModal";

type PaymentMethod = "upi" | "card" | "wallet" | "stripe" | "";

const TurfPaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [showStripe, setShowStripe] = useState(false);
  const [hasHandledStripe, setHasHandledStripe] = useState(false);

  const { successToast, errorToast } = useToaster();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    console.log("heylooo its stripe");
    if (location.state?.bookingData && !bookingData) {
      setBookingData(location.state.bookingData);
    }
  }, [location.state, bookingData]);

  useEffect(() => {
    const status = searchParams.get("status");
    const sessionId = searchParams.get("session_id");
    const queryBookingData = searchParams.get("bookingData");

    console.log("🔄 Stripe redirect effect ran", {
      status,
      sessionId,
      queryBookingData,
      hasHandledStripe,
    });

    let dataFromQuery: any = null;

    if (queryBookingData) {
      try {
        const decoded = decodeURIComponent(queryBookingData);
        console.log(" decoded bookingData:", decoded);
        dataFromQuery = JSON.parse(decoded);
        console.log(" parsed bookingData:", dataFromQuery);

        if (!bookingData) {
          setBookingData(dataFromQuery);
        }
      } catch (err) {
        console.error(" Error parsing bookingData from URL:", err);
        errorToast("Invalid booking data in URL");
      }
    } else {
      console.warn(" No bookingData param in URL");
    }

    const dataToUse = dataFromQuery || bookingData;
    console.log(" dataToUse for Stripe:", dataToUse);

    if (!hasHandledStripe) {
      if (status === "success" && sessionId && dataToUse) {
        console.log("Calling handleStripeSuccess", { sessionId });
        setHasHandledStripe(true);
        handleStripeSuccess(sessionId, dataToUse);
      } else if (status === "cancelled") {
        console.log(" Stripe status cancelled");
        setHasHandledStripe(true);
        setShowError(true);
        errorToast("Payment was cancelled. Please try again.");
      } else {
        console.log("Not triggering handleStripeSuccess yet", {
          status,
          sessionId,
          hasHandledStripe,
          hasData: !!dataToUse,
        });
      }
    }

    const timeout = setTimeout(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchParams, bookingData, hasHandledStripe, errorToast]);

  const handleStripeSuccess = async (sessionId: string, dataToUse: any) => {
    try {
      console.log("itsss success from stripe");
      if (!dataToUse?.slotDetails?.length) {
        throw new Error("Invalid booking data");
      }

      setIsProcessing(true);

      const verifyResponse = await fetch(
        `${
          import.meta.env.VITE_PRIVATE_API_URL
        }/api/payment/verify-session/${sessionId}`,
        { method: "GET" }
      );

      if (!verifyResponse.ok) {
        const errData = await verifyResponse.json().catch(() => ({}));
        throw new Error(
          `Verification failed: ${verifyResponse.status} - ${
            errData.message || "Unknown"
          }`
        );
      }

      const verifyJson = await verifyResponse.json();
      if (!verifyJson.success) throw new Error("Payment not confirmed");

      const finalData = dataToUse;

      for (const slot of finalData.slotDetails) {
        let parsedDate = new Date(finalData.date);
        if (isNaN(parsedDate.getTime())) {
          parsedDate = new Date(
            finalData.date.replace(/(\w{3}) (\d{1,2}), (\d{4})/, "$3-$2-$1")
          );
        }
        const formattedDate = finalData.date;

        const bookingPayload: Partial<IBookings> = {
          turfId: finalData.turfId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price.toString(),
          date: formattedDate,
          status: "confirmed",
          paymentMethod: "stripe",
          paymentStatus: "completed",
        };

        const resp = await bookSlots(bookingPayload);
        if (!resp.success) {
          throw new Error(
            `Failed to book slot ${slot.id}: ${resp.message || "Unknown"}`
          );
        }
      }

      successToast("Payment & Booking Confirmed! 🎉");
      setShowSuccess(true);
      setIsProcessing(false);

      setTimeout(() => navigate("/upcomingbookings"), 3000);
    } catch (error) {
      console.error("Stripe success handler error:", error);
      errorToast(
        error instanceof Error ? error.message : "Booking failed after payment"
      );
      setIsProcessing(false);
      setShowError(true);
    }
  };

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

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your turf booking has been confirmed
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Booking ID</p>
            <p className="font-mono font-semibold text-gray-800">
              #TRF{Math.random().toString(36).substr(2, 8).toUpperCase()}
            </p>
          </div>

          <button
            onClick={() => navigate("/upcomingbookings")}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            View Booking Details
          </button>
        </motion.div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Payment Issue
          </h2>
          <p className="text-gray-600 mb-6">
            Something went wrong or was cancelled. Try again?
          </p>
          <button
            onClick={() => {
              setShowError(false);
              setSelectedPayment("");
              setBookingData(null);
            }}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Retry Payment
          </button>
        </motion.div>
      </div>
    );
  }

  if (!bookingData) {
    if (status === "success") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg font-semibold text-gray-600">
            Processing your payment... ⏳
          </p>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-red-500">
          No booking data found. Please select a turf and try again.
        </p>
      </div>
    );
  }

  const paymentOptions = [
    {
      id: "upi",
      name: "UPI",
      description: "Pay using UPI apps like GPay, PhonePe, Paytm",
      icon: Smartphone,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, RuPay accepted",
      icon: CreditCard,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      description: "Paytm, PhonePe, Amazon Pay wallet",
      icon: Wallet,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "stripe",
      name: "International Cards",
      description: "Powered by Stripe - Global payment processing",
      icon: Globe,
      color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ] as const;

  const handlePayment = async (paymentMethod: PaymentMethod) => {
    if (!bookingData) {
      errorToast("No booking data to process payment.");
      return;
    }

    if (paymentMethod === "stripe") {
      setShowStripe(true);
      return;
    }

    try {
      setIsProcessing(true);
      for (const slot of bookingData.slotDetails) {
        // const parsedDate = new Date(bookingData.date);
        const formattedDate = bookingData.date;
        const bookingPayload: Partial<IBookings> = {
          turfId: bookingData.turfId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price.toString(),
          date: formattedDate,
          status: "confirmed",
          paymentMethod: paymentMethod,
          paymentStatus: "completed",
        };

        const response = await bookSlots(bookingPayload);
        if (!response.success) {
          throw new Error(`Failed to create booking for slot ${slot.id}`);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsProcessing(false);
      setShowSuccess(true);
      successToast("Booking Confirmed successfully");

      setTimeout(() => navigate("/upcomingbookings"), 3000);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      errorToast(
        "An error occurred during payment processing. Please try again."
      );
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              disabled={isProcessing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Complete Payment
              </h1>
              <p className="text-sm text-gray-600">
                Secure checkout - {isProcessing && "Processing..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <h3 className="font-semibold text-gray-800 mb-4">
                Booking Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {bookingData.turfName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {bookingData.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">{bookingData.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {bookingData.slots?.join(", ")}
                  </p>
                </div>
              </div>
              <div className="mt-6 border-t pt-4 flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{bookingData.totalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {paymentOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment(option.id)}
                  disabled={isProcessing}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all disabled:opacity-50 ${
                    selectedPayment === option.id
                      ? "border-2 border-primary bg-primary/10"
                      : `${option.color} border`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <option.icon className={`w-6 h-6 ${option.iconColor}`} />
                    <div className="text-left">
                      <p className="font-medium text-gray-800">{option.name}</p>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  {selectedPayment === option.id && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Pay Button */}
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedPayment || isProcessing}
                onClick={() => handlePayment(selectedPayment)}
                className="w-full py-4 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-white font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors"
              >
                {isProcessing ? "Processing..." : "Pay Now"}
                <Lock className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {showStripe && bookingData && (
        <StripeModal
          amount={bookingData.totalAmount}
          bookingData={bookingData}
          onError={(err) => {
            errorToast(err.message || "Payment setup failed");
            setShowStripe(false);
            setShowError(true);
          }}
        />
      )}
    </div>
  );
};

export default TurfPaymentPage;
