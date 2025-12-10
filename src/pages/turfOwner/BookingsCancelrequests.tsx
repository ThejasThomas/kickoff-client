import { useEffect, useState } from "react";
import { Loader2, Calendar, Clock, User, DollarSign, Phone, Mail } from "lucide-react";
import { useToaster } from "@/hooks/ui/useToaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import type { ICancelRequestItem } from "@/types/cancel_requests_type";
import { getCancelRequests, handleCancelRequestAction } from "@/services/TurfOwner/turfOwnerService";

const CancelRequestsPage = () => {
  const [requests, setRequests] = useState<ICancelRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selected, setSelected] = useState<ICancelRequestItem | null>(null);
  const { successToast, errorToast } = useToaster();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getCancelRequests();
      console.log('res',res)
      if (res.success) setRequests(res.data);
    } catch {
      errorToast("Failed to fetch cancel requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "approved" | "rejected") => {
    if (!selected) return;
    setActionLoading(true);

    try {
      const res = await handleCancelRequestAction(selected._id,action,selected.userId);

      successToast(res.message);

      setRequests((prev) =>
        prev.map((r) =>
          r._id === selected._id ? { ...r, status: action } : r
        )
      );

      setSelected(null);
    } catch (err: any) {
      errorToast(err?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-emerald-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cancellation Requests</h1>

      {!requests || requests.length === 0 ? (
        <p className="text-gray-500 mt-10 text-center">No pending requests</p>
      ) : (
        <div className="grid gap-6">
          {requests.map((req, index) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow-lg rounded-xl p-6 border"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Booking Cancellation</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {req.status.toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User: {req.user?.name || req.userId}
                </p>

                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date: {req.booking?.date}
                </p>

                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time: {req.booking?.startTime} - {req.booking?.endTime}
                </p>

                <p className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Refund: ₹{req.booking?.price}
                </p>

                <p className="font-medium">
                  Reason: <span className="text-gray-600">{req.reason}</span>
                </p>
              </div>

              {/* Action Button */}
              {req.status === "pending" && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setSelected(req)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                  >
                    View / Handle
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* ⭐ DETAILED VIEW MODAL */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancellation Request Details</DialogTitle>
            <DialogDescription>
              Review booking and user information before taking action.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 mt-3">
              {/* USER SECTION */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">User Information</h3>

                <p className="flex items-center gap-2">
                  <User className="w-4 h-4" /> {selected.user?.name}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {selected.user?.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {selected.user?.phone || "N/A"}
                </p>
              </div>

              {/* BOOKING SECTION */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">Booking Information</h3>

                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {selected.booking?.date}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {selected.booking?.startTime} - {selected.booking?.endTime}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> ₹{selected.booking?.price}
                </p>
              </div>

              {/* REASON */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">Reason for Cancellation</h3>
                <p className="text-gray-700">{selected.reason}</p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 flex gap-4">
            <button
              disabled={actionLoading}
              onClick={() => handleAction("approved")}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg"
            >
              {actionLoading ? "Processing..." : "Approve Refund"}
            </button>

            <button
              disabled={actionLoading}
              onClick={() => handleAction("rejected")}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
            >
              {actionLoading ? "Processing..." : "Reject Request"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CancelRequestsPage;
