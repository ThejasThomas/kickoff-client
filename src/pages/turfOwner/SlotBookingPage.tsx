"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ClockIcon,
  Zap,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useGetTurfById } from "@/hooks/turfOwner/getTurfById";
import { useAddSlotMutation } from "@/hooks/turfOwner/addSlots";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useToaster } from "@/hooks/ui/useToaster";
import { isAxiosError } from "axios";

const GenerateSlotsPage: React.FC = () => {
  const { id: turfId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { errorToast, successToast } = useToaster();

  const { data: turf, isLoading: isTurfLoading } = useGetTurfById(turfId || "");
  const generateSlotsMutation = useAddSlotMutation();

  const [isMultiDay, setIsMultiDay] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [slotDuration, setSlotDuration] = useState(1);
  const [price, setPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  console.log("turfffIddd", turfId);

  useEffect(() => {
    if (turf?.pricePerHour) {
      setPrice(Number(turf.pricePerHour));
    }
  }, [turf]);

  const validateInputs = () => {
    if (!startTime || !endTime) {
      const errorMsg = "Start time and end time are required.";
      errorToast(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    const startHour = Number.parseInt(startTime.split(":")[0]);
    const endHour = Number.parseInt(endTime.split(":")[0]);
    if (startHour >= endHour) {
      const errorMsg = "End time must be after start time.";
      errorToast(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;
    }

    if (slotDuration <= 0) {
      const errorMsg = "Slot duration must be greater than 0.";
      errorToast(errorMsg);
      return false;
    }

    if (price < 0) {
      const errorMsg = "Price cannot be negative.";
      errorToast(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    if (isMultiDay) {
      if (selectedDate > endDate) {
        const errorMsg = "End date must be after start date.";
        errorToast(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    }

    return true;
  };

  const handleGenerateSlots = () => {
    if (!validateInputs()) {
      return;
    }

    const baseData = {
      turfId,
      startTime,
      endTime,
      slotDuration,
      price,
    };

    const data: any = { ...baseData };

    if (isMultiDay) {
      data.selectedDate = format(selectedDate, "yyyy-MM-dd");
      data.endDate = format(endDate, "yyyy-MM-dd");
    } else {
      data.date = format(date, "yyyy-MM-dd");
    }

    generateSlotsMutation.mutate(data, {
      onSuccess: (response) => {
        successToast(response.message);
        navigate("/turfOwner/my-turfs", {
          state: { successMessage: "Slots generated successfully!" },
        });
      },
      onError: (error: unknown) => {
        let message = "Something went wrong";
        if (isAxiosError(error)) {
          message = error.response?.data?.message || error.message || message;
        }
        errorToast(message);
      },
    });
  };

  if (isTurfLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-20 h-20 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Turf Details
          </h2>
          <p className="text-green-200">Please wait...</p>
        </motion.div>
      </div>
    );
  }

  if (!turf || !turfId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Turf Not Found</h2>
          <p className="text-red-400">The selected turf could not be loaded.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-300/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Generate Slots
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Building2 className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold text-green-400">
                  {turf.turfName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-green-200">
            <MapPin className="w-5 h-5" />
            <p className="text-lg">
              {turf.location.address}, {turf.location.city}
            </p>
          </div>
        </motion.div>

        {/* Main Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12"
        >
          {/* Slot Type Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <Label className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-green-400" />
              Slot Generation Type
            </Label>
            <RadioGroup
              value={isMultiDay ? "multi" : "single"}
              onValueChange={(value) => setIsMultiDay(value === "multi")}
              className="flex gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  !isMultiDay
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400 shadow-lg"
                    : "bg-white/5 border-white/20 hover:border-green-400/50"
                }`}
              >
                <RadioGroupItem
                  value="single"
                  id="single"
                  className="text-green-400"
                />
                <Label
                  htmlFor="single"
                  className="text-white font-semibold text-lg cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Single Day
                </Label>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isMultiDay
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400 shadow-lg"
                    : "bg-white/5 border-white/20 hover:border-green-400/50"
                }`}
              >
                <RadioGroupItem
                  value="multi"
                  id="multi"
                  className="text-green-400"
                />
                <Label
                  htmlFor="multi"
                  className="text-white font-semibold text-lg cursor-pointer flex items-center gap-2"
                >
                  <CalendarIcon className="w-5 h-5" />
                  Multi-Day
                </Label>
              </motion.div>
            </RadioGroup>
          </motion.div>

          {/* Common Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8 mb-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-white font-semibold text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  Start Time
                </Label>
                <div className="relative group">
                  <ClockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400 z-10" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setStartTime(e.target.value)
                    }
                    className="pl-12 pr-4 py-4 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-green-200 text-lg font-medium transition-all duration-300 hover:bg-white/15"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-white font-semibold text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  End Time
                </Label>
                <div className="relative group">
                  <ClockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400 z-10" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEndTime(e.target.value)
                    }
                    className="pl-12 pr-4 py-4 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-green-200 text-lg font-medium transition-all duration-300 hover:bg-white/15"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-white font-semibold text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  Slot Duration (hours)
                </Label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={slotDuration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSlotDuration(Number(e.target.value))
                  }
                  className="px-4 py-4 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-green-200 text-lg font-medium transition-all duration-300 hover:bg-white/15"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-white font-semibold text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Price per Slot
                </Label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPrice(Number(e.target.value))
                  }
                  className="px-4 py-4 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-green-200 text-lg font-medium transition-all duration-300 hover:bg-white/15"
                />
              </div>
            </div>
          </motion.div>

          {/* Date Fields with Animation */}
          <AnimatePresence mode="wait">
            {!isMultiDay ? (
              <motion.div
                key="single-day"
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-6 mb-10"
              >
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-green-400" />
                    Single Day Booking
                  </h3>
                  <div className="space-y-3">
                    <Label className="text-white font-semibold text-lg">
                      Select Date
                    </Label>
                    <div className="relative group">
                      <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400 z-10" />
                      <input
                        type="date"
                        value={format(date, "yyyy-MM-dd")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setDate(new Date(e.target.value))
                        }
                        className="pl-12 pr-4 py-4 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent text-white text-lg font-medium transition-all duration-300 hover:bg-white/15"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="multi-day"
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-6 mb-10"
              >
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-400/30">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-emerald-400" />
                    Multi-Day Booking
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-white font-semibold text-lg">
                        Start Date
                      </Label>
                      <input
                        type="date"
                        value={format(selectedDate, "yyyy-MM-dd")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSelectedDate(new Date(e.target.value))
                        }
                        className="px-4 py-4 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-white text-lg font-medium transition-all duration-300 hover:bg-white/15"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white font-semibold text-lg">
                        End Date
                      </Label>
                      <input
                        type="date"
                        value={format(endDate, "yyyy-MM-dd")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSelectedDate(new Date(e.target.value))
                        }
                        className="px-4 py-4 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-white text-lg font-medium transition-all duration-300 hover:bg-white/15"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {/* <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-2xl backdrop-blur-sm"
              >
                <p className="text-red-300 font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {errorMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence> */}

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              onClick={handleGenerateSlots}
              disabled={generateSlotsMutation.isPending}
              className="w-full py-6 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {generateSlotsMutation.isPending ? (
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  Generating Slots...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Generate Slots
                </div>
              )}
            </Button>
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {generateSlotsMutation.isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="mt-6 p-4 bg-green-500/20 border border-green-400/50 rounded-2xl backdrop-blur-sm"
              >
                <p className="text-green-300 font-medium flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Slots generated successfully!{" "}
                  {generateSlotsMutation.data?.slots.length} slots created.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default GenerateSlotsPage;
