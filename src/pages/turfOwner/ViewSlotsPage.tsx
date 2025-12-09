import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  Settings,
  Timer,
  AlertCircle,
  Edit3,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/image-header";
import { formatTime } from "@/components/ui/format-date";
import type { IRules, ITimeRange } from "@/types/rules_type";
import { useNavigate, useParams } from "react-router-dom";
import { getRules } from "@/services/TurfOwner/turfOwnerService";

const getDayName = (day: string): string => {
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
};

const TurfRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: turfId } = useParams<{ id: string }>();
  const [rules, setRules] = useState<IRules | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  useEffect(() => {
    const loadRules = async () => {
      if (!turfId) {
        setError("No turf ID provided");
        setRules(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const loadedRules = await getRules(turfId);
        console.log("Loaded Rules:", loadedRules.rules.weeklyRules);
        if (!loadedRules.success) {
          setError("Failed to fetch rules");
          setRules(null);
          return;
        }
        const adjustedRules = {
          ...loadedRules.rules,
          weeklyRules: Array.isArray(loadedRules.rules.weeklyRules)
            ? loadedRules.rules.weeklyRules
            : [],
        };
        setRules(adjustedRules);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load turf rules"
        );
        setRules(null);
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, [turfId]);

  if (!turfId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-green-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.15)_1px,transparent_0)] [background-size:20px_20px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader
            badge="Error"
            title="Turf Rules Management"
            description="Unable to load turf configuration"
          />
          <ErrorState
            message="No turf ID provided"
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-green-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.15)_1px,transparent_0)] [background-size:20px_20px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader
            badge="Loading..."
            title="Turf Rules Management"
            description="Please wait while we load your turf configuration"
            loading={true}
          />
          <LoadingSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (error && !rules) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-green-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.15)_1px,transparent_0)] [background-size:20px_20px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader
            badge="Error"
            title="Turf Rules Management"
            description="Unable to load turf configuration"
          />
          <ErrorState
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (!rules) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-green-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.15)_1px,transparent_0)] [background-size:20px_20px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader
            badge="Setup Required"
            title="Turf Rules Management"
            description="Configure your turf availability and pricing"
          />
          <EmptyState
            icon={<Settings className="w-12 h-12" />}
            title="No Rules Configured"
            description="Set up your turf rules to start accepting bookings"
            actionLabel="Create Rules"
            onAction={() => navigate(`/turfOwner/generate-slots/${turfId}`)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-green-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.15)_1px,transparent_0)] [background-size:20px_20px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            badge="Settings"
            title="Turf Rules Management"
            description="View your turf availability, pricing, and slot duration"
          />
          <Button
            onClick={() => navigate(`/turfOwner/generate-slots/${turfId}`)}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Slots
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* General Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-2 border-gradient-to-r from-emerald-200 to-green-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Timer className="w-4 h-4 text-emerald-600" />
                    Slot Duration (hours)
                  </Label>
                  <p className="text-lg font-semibold text-gray-800">
                    {rules.slotDuration} hours
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Price per Slot (₹)
                  </Label>
                  <p className="text-lg font-semibold text-gray-800">
                    ₹{rules.price}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-2 border-gradient-to-r from-emerald-200 to-green-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6">
                {daysOfWeek.map((day, dayIndex) => {
                  const weekRule = rules.weeklyRules[0] || {};
                  const daySlots: ITimeRange[] = weekRule[dayIndex] || [];
                  const totalHours = daySlots.reduce(
                    (acc: number, slot: ITimeRange) => {
                      const start = new Date(`2000-01-01T${slot.startTime}`);
                      const end = new Date(`2000-01-01T${slot.endTime}`);
                      return (
                        acc +
                        (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                      );
                    },
                    0
                  );

                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: dayIndex * 0.1 }}
                      className="border border-emerald-200 rounded-xl p-6 bg-gradient-to-r from-white to-emerald-50/30"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {day.slice(0, 3).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">
                              {getDayName(day)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {daySlots.length} slots • {totalHours.toFixed(1)}{" "}
                              hours total
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                          {daySlots.map(
                            (slot: ITimeRange, slotIndex: number) => (
                              <motion.div
                                key={slotIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white border border-emerald-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                    <span className="font-semibold text-gray-800">
                                      {formatTime(slot.startTime)} -{" "}
                                      {formatTime(slot.endTime)}
                                    </span>
                                  </div>
                                </div>
                                {/* <div className="mt-2 text-xs text-gray-500">
                Duration:{" "}
                {Math.round(
                  (new Date(`2000-01-01T${slot.endTime}`).getTime() -
                    new Date(`2000-01-01T${slot.startTime}`).getTime()) /
                    (1000 * 60)
                )}{" "}
                minutes
              </div> */}
                              </motion.div>
                            )
                          )}
                        </AnimatePresence>
                      </div>

                      {daySlots.length === 0 && (
                        <EmptyState
                          icon={<Clock className="w-8 h-8" />}
                          title={`No slots for ${getDayName(day)}`}
                          description="No time slots are defined for this day"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Exceptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-gradient-to-r from-red-200 to-rose-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-red-100 bg-gradient-to-r from-red-50 to-rose-50">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                Exception Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {rules.exceptions.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {rules.exceptions.map((exception, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-600" />
                        <span className="font-semibold text-red-800">
                          {new Date(exception.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Calendar className="w-8 h-8" />}
                  title="No Exception Dates"
                  description="No exception dates are defined for this turf"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TurfRulesPage;
