import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Globe,
  ArrowLeft,
  CheckCircle,
  MapPin,
  Clock,
  Calendar,
  Lock,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookSlots } from "@/services/client/clientService";
import type { IBookings } from "@/types/Booking_type";
import { useToaster } from "@/hooks/ui/useToaster";

type PaymentMethod = "upi" | "card" | "wallet" | "stripe" | "";

const TurfPaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { successToast, errorToast } = useToaster();

  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData } = location.state || {};
  console.log("bookingdata.date", bookingData.date);

  if (!bookingData) {
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
    setIsProcessing(true);

    try {
      for (const slot of bookingData.slotDetails) {
  const formattedDate = new Date(bookingData.date).toLocaleDateString("en-CA"); 
        console.log("dateeeeee", formattedDate);
        console.log("heybossss");
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

      setTimeout(() => {
        console.log(`Payment successful with ${paymentMethod}`);
        navigate("/upcomingbookings");
      }, 3000);
    } catch (error) {
      console.error("Payment processing error:", error);
      setIsProcessing(false);
      errorToast(
        "An error occurred during payment processing. Please try again."
      );
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
            onClick={() => navigate("/")}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            View Booking Details
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Complete Payment
              </h1>
              <p className="text-sm text-gray-600">
                Secure checkout with 256-bit SSL encryption
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
                    {bookingData.slots.join(", ")}
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
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
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
    </div>
  );
};

export default TurfPaymentPage;
