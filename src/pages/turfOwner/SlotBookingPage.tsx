import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Zap,
  Trash2,
  PlusCircle,
  Sparkles,
  CheckCircle,
  AlertCircle,
  DollarSign,
  MapPin,
  Building2,
} from "lucide-react";
import { useGetTurfById } from "@/hooks/turfOwner/getTurfById";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useToaster } from "@/hooks/ui/useToaster";
import { isAxiosError } from "axios";
import { useAddRulesMutation } from "@/hooks/turfOwner/addRules";
import { getRules } from "@/services/TurfOwner/turfOwnerService";
import type { IException, ITimeRange, IWeekRules } from "@/types/rules_type";

// Helper function to convert time to minutes for comparison
const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const GenerateRulesPage: React.FC = () => {
  const { id: turfId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { errorToast, successToast } = useToaster();

  const { data: turf, isLoading: isTurfLoading } = useGetTurfById(turfId || "");
  const addRulesMutation = useAddRulesMutation();

  const [weeklyRules, setWeeklyRules] = useState<IWeekRules>({
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
  });
  const [slotDuration, setSlotDuration] = useState(1);
  const [price, setPrice] = useState(0);
  const [exceptions, setExceptions] = useState<IException[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [newExceptionDate, setNewExceptionDate] = useState<Date>(new Date());
  const [loadingRules, setLoadingRules] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRules = async () => {
      if (!turfId) {
        setError("No turf ID provided");
        return;
      }

      setLoadingRules(true);
      setError(null);

      try {
        const loadedRules = await getRules(turfId);
        console.log("Loaded Rules:", loadedRules.rules);
        if (!loadedRules.success) {
          setError("Failed to fetch rules");
          return;
        }

        const rulesData = loadedRules.rules;
        setWeeklyRules(rulesData.weeklyRules[0] || { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });
        setSlotDuration(rulesData.slotDuration || 1);
        setPrice(rulesData.price || 0);
        setExceptions(rulesData.exceptions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load turf rules");
      } finally {
        setLoadingRules(false);
      }
    };

    loadRules();
  }, [turfId]);

  useEffect(() => {
    if (turf?.pricePerHour) {
      setPrice(Number(turf.pricePerHour));
    }
  }, [turf]);

  const validateTimeRange = (range: ITimeRange) => {
    if (!range.startTime || !range.endTime) return "Start and end times are required.";
    const startHour = Number.parseInt(range.startTime.split(":")[0]);
    const endHour = Number.parseInt(range.endTime.split(":")[0]);
    if (startHour >= endHour) return "End time must be after start time.";
    return null;
  };

  const validateInputs = () => {
    if (!turfId) {
      errorToast("Turf ID is required.");
      return false;
    }
    if (slotDuration <= 0) {
      errorToast("Slot duration must be greater than 0.");
      return false;
    }
    if (price < 0) {
      errorToast("Price cannot be negative.");
      return false;
    }

    for (const day in weeklyRules) {
      const dayRanges = weeklyRules[day];
      for (const range of dayRanges) {
        const error = validateTimeRange(range);
        if (error) {
          errorToast(`Invalid time range for ${getDayName(day)}: ${error}`);
          return false;
        }

        const duplicateStart = dayRanges.filter(r => r.startTime === range.startTime).length > 1;
        if (duplicateStart) {
          errorToast(`Duplicate start time ${range.startTime} found for ${getDayName(day)}.`);
          return false;
        }

        for (const otherRange of dayRanges) {
          if (otherRange !== range) {
            const newStart = parseTimeToMinutes(range.startTime);
            const newEnd = parseTimeToMinutes(range.endTime);
            const existingStart = parseTimeToMinutes(otherRange.startTime);
            const existingEnd = parseTimeToMinutes(otherRange.endTime);

            if (
              (newStart >= existingStart && newStart < existingEnd) ||
              (newEnd > existingStart && newEnd <= existingEnd) ||
              (newStart <= existingStart && newEnd >= existingEnd)
            ) {
              errorToast(
                `Time conflict detected: ${range.startTime} - ${range.endTime} overlaps with ${otherRange.startTime} - ${otherRange.endTime} on ${getDayName(day)}.`
              );
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  const addTimeRange = (day: number) => {
    setWeeklyRules((prev) => ({
      ...prev,
      [day]: [...prev[day], { startTime: "09:00", endTime: "10:00" }],
    }));
  };

  const removeTimeRange = (day: number, index: number) => {
    setWeeklyRules((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const updateTimeRange = (day: number, index: number, field: "startTime" | "endTime", value: string) => {
    setWeeklyRules((prev) => ({
      ...prev,
      [day]: prev[day].map((range, i) =>
        i === index ? { ...range, [field]: value } : range
      ),
    }));
  };

  const addException = () => {
    setExceptions((prev) => [
      ...prev,
      { date: format(newExceptionDate, "yyyy-MM-dd") },
    ]);
    setNewExceptionDate(new Date());
  };

  const removeException = (index: number) => {
    setExceptions((prev) => prev.filter((_, i) => i !== index));
  };

  const getDayName = (day: number | string) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[Number(day)];
  };

  const generatePreviewSlots = (day: number) => {
    const ranges = weeklyRules[day];
    let slots: string[] = [];
    ranges.forEach((range) => {
      let start = new Date(`2025-01-01T${range.startTime}`);
      const end = new Date(`2025-01-01T${range.endTime}`);
      while (start < end) {
        const slotEnd = new Date(start.getTime() + slotDuration * 60 * 60 * 1000);
        if (slotEnd <= end) {
          slots.push(
            `${format(start, "HH:mm")} - ${format(slotEnd, "HH:mm")}`
          );
        }
        start = slotEnd;
      }
    });
    return slots;
  };

  const handleSaveRules = () => {
    if (!validateInputs() || !turfId) return;

    const data = {
      turfId,
      ownerId: turf?.ownerId || "",
      weeklyRules: [weeklyRules],
      exceptions,
      slotDuration,
      price,
      duration: `${slotDuration}h`,
    };

    addRulesMutation.mutate(data, {
      onSuccess: (response) => {
        successToast(response.message || "Rules saved successfully!");
        navigate("/turfOwner/add-slots", {
          state: { successMessage: "Rules saved successfully!" },
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

  if (isTurfLoading || loadingRules) {
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

  if (!turf || !turfId || error) {
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
          <p className="text-red-400">{error || "The selected turf could not be loaded."}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-300/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 max-w-5xl mx-auto">
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
                Manage Availability Rules
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <Label className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-green-400" />
              Weekly Availability Rules
            </Label>
            <div className="space-y-6">
              {Object.keys(weeklyRules).map((day) => (
                <div
                  key={day}
                  className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30"
                >
                  <h3 className="text-xl font-bold text-white mb-4">
                    {getDayName(day)}
                  </h3>
                  {weeklyRules[Number(day)].map((range, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Start Time</Label>
                          <input
                            type="time"
                            value={range.startTime}
                            onChange={(e) =>
                              updateTimeRange(Number(day), index, "startTime", e.target.value)
                            }
                            className="px-4 py-3 w-full bg-white/10 border border-white/20 rounded-xl text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">End Time</Label>
                          <input
                            type="time"
                            value={range.endTime}
                            onChange={(e) =>
                              updateTimeRange(Number(day), index, "endTime", e.target.value)
                            }
                            className="px-4 py-3 w-full bg-white/10 border border-white/20 rounded-xl text-white"
                          />
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeTimeRange(Number(day), index)}
                        className="bg-red-500/20 hover:bg-red-500/40"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addTimeRange(Number(day))}
                    className="bg-green-500/20 hover:bg-green-500/40 text-white"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Time Range
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8 mb-10"
          >
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-10"
          >
            <Label className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-green-400" />
              Exceptions (Closed Days)
            </Label>
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-400/30 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Add New Exception</h3>
              <div className="space-y-3 mb-4">
                <Label className="text-white font-semibold">Date</Label>
                <input
                  type="date"
                  value={format(newExceptionDate, "yyyy-MM-dd")}
                  onChange={(e) => setNewExceptionDate(new Date(e.target.value))}
                  className="px-4 py-4 w-full bg-white/10 border border-white/20 rounded-xl text-white"
                />
              </div>
              <Button
                onClick={addException}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Exception
              </Button>
            </div>
            {exceptions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Existing Exceptions</h3>
                {exceptions.map((ex, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/20"
                  >
                    <p className="text-white font-semibold">{ex.date} (Closed)</p>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeException(index)}
                      className="bg-red-500/20 hover:bg-red-500/40"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-10"
          >
            <Label className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-green-400" />
              Preview Slots for {getDayName(selectedDay)}
            </Label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="mb-4 px-4 py-3 w-full bg-white/10 border border-white/20 rounded-xl text-white"
            >
              {Object.keys(weeklyRules).map((day) => (
                <option key={day} value={day} className="bg-slate-900">
                  {getDayName(day)}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {generatePreviewSlots(selectedDay).map((slot, index) => (
                <div
                  key={index}
                  className="bg-green-500/20 p-3 rounded-xl text-center text-white"
                >
                  {slot}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button
              onClick={handleSaveRules}
              disabled={addRulesMutation.isPending}
              className="w-full py-6 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {addRulesMutation.isPending ? (
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
                  Saving Rules...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Save Rules
                </div>
              )}
            </Button>
          </motion.div>

          <AnimatePresence>
            {addRulesMutation.isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="mt-6 p-4 bg-green-500/20 border border-green-400/50 rounded-2xl backdrop-blur-sm"
              >
                <p className="text-green-300 font-medium flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Rules saved successfully!
                  
                </p>
                
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default GenerateRulesPage;