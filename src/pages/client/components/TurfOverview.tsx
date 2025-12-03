import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Phone,
  Trophy,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { ITurf } from "@/types/Turf";
import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTurfById, getSlots } from "@/services/client/clientService";
import type { ISlot } from "@/types/Slot";

const TurfOverview: React.FC = () => {
  const [turf, setTurf] = useState<ITurf | null>(null);
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const today = new Date().toLocaleDateString("en-CA"); 

  useEffect(() => {
    const fetchTurf = async () => {
      if (!id) {
        setError("No turf ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const turfData = await getTurfById(id);
        setTurf(turfData);
      } catch (err) {
        console.error("Error fetching turf:", err);
        setError("An error occurred while fetching turf details");
      } finally {
        setLoading(false);
      }
    };

    fetchTurf();
  }, [id]);

  useEffect(() => {
  const fetchSlots = async () => {
    if (!id || !selectedDate) return;

    try {
      const slotData = await getSlots(id, selectedDate);
      console.log("Slots from backend:", slotData);

      setSlots(Array.isArray(slotData) ? slotData : []);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setError("Could not fetch slots");
    }
  };

  fetchSlots();
}, [id, selectedDate]);


  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      turf?.images && prev < turf.images.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      turf?.images && prev > 0 ? prev - 1 : (turf?.images?.length ?? 0) - 1
    );
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlots((prev) => {
      const isCurrentlySelected = prev.includes(slotId);
      if (isCurrentlySelected) {
        return prev.filter((id) => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const getTotalPrice = () => {
    return selectedSlots.reduce((total, slotId) => {
      const slot = slots.find((s) => s.id === slotId);
      return total + (slot?.price || 0);
    }, 0);
  };

  const handleContinue = () => {
    if (selectedSlots.length === 0) {
      return;
    }

    const selectedSlotDetails = selectedSlots.map((slotId) => {
      const slot = slots.find((s) => s.id === slotId);
      return {
        id: slotId,
        startTime: slot?.startTime,
        endTime: slot?.endTime,
        price: slot?.price,
        duration: slot?.duration,
      };
    });

    const formattedSlots = selectedSlotDetails.map(
      (slot) => `${slot.startTime} - ${slot.endTime}`
    );

    const bookingData = {
      turfId: id,
      turfName: turf?.turfName || "",
      location: `${turf?.location?.address}, ${turf?.location?.city}` || "",
      date: new Date(selectedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      slots: formattedSlots,
      selectedSlotIds: selectedSlots,
      slotDetails: selectedSlotDetails,
      totalAmount: getTotalPrice(),
      contactNumber: turf?.contactNumber || "",
      courtType: turf?.courtType || "",
    };

    navigate("/paymentpage", {
      state: { bookingData },
    });
  };

  const isDefaultSlot = (slot: ISlot) => {
    return (
      slot.startTime === "00:00" && slot.endTime === "00:00" && slot.price === 0
    );
  };

  const hasOnlyDefaultSlots = () => {
    return slots.length > 0 && slots.every((slot) => isDefaultSlot(slot));
  };

  const getAvailableSlots = () => {
    return slots.filter((slot) => !isDefaultSlot(slot)  && !slot.isBooked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Loading Turf Details
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch the information...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !turf) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-destructive text-lg mb-6">
            {error || "Turf not found"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image Carousel */}
      <div className="relative h-[60vh] overflow-hidden">
        <motion.img
          key={currentImageIndex}
          src={
            turf.images && turf.images.length > 0
              ? turf.images[currentImageIndex]
              : "/placeholder.svg?height=600&width=1200&query=professional football turf field stadium"
          }
          alt={turf.turfName}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Navigation Arrows */}
        {turf.images && turf.images.length > 1 && (
          <>
            <motion.button
              onClick={handlePrevImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={handleNextImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
                {turf.turfName}
              </h1>
              <div className="flex items-center gap-4 text-white/90 text-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {turf.location?.address}, {turf.location?.city}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Image Indicators */}
        {turf.images && turf.images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {turf.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Turf Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Cards */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-card rounded-xl p-4 border border-border text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Hours</p>
                <p className="font-semibold text-card-foreground">
                  {turf.openingTime} - {turf.closingTime}12
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border text-center">
                <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Court Type</p>
                <p className="font-semibold text-card-foreground">
                  {turf.courtType}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border text-center">
                <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-semibold text-card-foreground">
                  {turf.contactNumber}
                </p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="bg-card rounded-xl p-6 border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-card-foreground mb-4">
                About This Facility
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {turf.description}
              </p>
            </motion.div>

            {/* Amenities */}
            {turf.amenities && turf.amenities.length > 0 && (
              <motion.div
                className="bg-card rounded-xl p-6 border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  Amenities & Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {turf.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-card-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Booking Section */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-card rounded-xl border border-border sticky top-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Pricing Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-card-foreground">
                    ₹{turf.pricePerHour}
                  </span>
                  <span className="text-muted-foreground">/hour</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Base price per hour
                </p>
              </div>

              {/* Date Selection */}
              <div className="p-6 border-b border-border">
                <label className="block text-sm font-medium text-card-foreground mb-3">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={today}
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Available Slots */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Available Time Slots
                </h3>
                {slots.length === 0 || hasOnlyDefaultSlots() ? (
                  <motion.div
                    className="text-center py-12 px-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-orange-500" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-card-foreground mb-2">
                      {hasOnlyDefaultSlots()
                        ? "Turf Unavailable"
                        : "No Slots Available"}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {hasOnlyDefaultSlots()
                        ? "This turf is closed on the selected date. Please choose another date to view available slots."
                        : "No time slots are available for this date. Please select a different date."}
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Try selecting another date</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getAvailableSlots().map((slot, index) => (
                      <motion.div
                        key={`${slot.id}-${index}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          slot.isBooked
                            ? "bg-muted border-border opacity-50 cursor-not-allowed"
                            : selectedSlots.includes(slot.id)
                            ? "bg-primary/10 border-primary"
                            : "bg-input border-border hover:border-primary/50"
                        }`}
                        onClick={() =>
                          !slot.isBooked && handleSlotSelect(slot.id)
                        }
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-card-foreground">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {slot.duration} hour • ₹{slot.price}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {slot.isBooked ? (
                              <span className="text-destructive font-medium">
                                Booked
                              </span>
                            ) : selectedSlots.includes(slot.id) ? (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total and Continue Button */}
              {selectedSlots.length > 0 && (
                <motion.div
                  className="p-6 border-t border-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-card-foreground font-medium">
                      Total ({selectedSlots.length} slot
                      {selectedSlots.length > 1 ? "s" : ""})
                    </span>
                    <span className="text-2xl font-bold text-card-foreground">
                      ₹{getTotalPrice()}
                    </span>
                  </div>
                </motion.div>
              )}

              <div className="p-6 pt-0">
                <motion.button
                  onClick={handleContinue}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedSlots.length === 0}
                  className="w-full py-4 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                  {selectedSlots.length > 0
                    ? "Continue to Payment"
                    : "Select Slots to Continue"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfOverview;
