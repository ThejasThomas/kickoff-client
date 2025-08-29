"use client";

import { GenericTable } from "@/components/ReusableComponents/GenericTable";
import RejectionModal from "@/components/ReusableComponents/RejectionModal";
import { adminService } from "@/services/admin/adminService";
import type { ApiResponse, FetchParams } from "@/types/api.type";
import type {
  ExtendableItem,
  TableAction,
  TableColumn,
} from "@/types/table_type";
import type { ITurf } from "@/types/Turf";
import { Check, MapPin, X, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Turf extends ExtendableItem {
  _id: string;
  turfName: string;
  location: string;
  courtType: string;
  status: string;
  createdAt: string;
  pricePerHour: string;
  amenities: string[];
  images: string[];
}

type turfStatus = "approved" | "rejected" | "pending";

export default function TurfVerification() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTurfId, setSelectedTurfId] = useState<string | null>(null);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  const turfRejectionReasons = [
    "Incomplete turf details",
    "Invalid location/address",
    "Suspicious or fraudulent listing",
  ];

  const fetchTurfs = async (
    params: FetchParams
  ): Promise<ApiResponse<ITurf>> => {
    try {
      const response = await adminService.getAllTurfs({
        page: params.page,
        limit: params.limit,
        search: params.search,
        excludeStatus: ["approved", "rejected", "blocked"],
      });

   const turfs: ITurf[] = response.turfs.map((turf: any) => ({
  _id: turf._id,
  turfName: turf.turfName || "Unknown Turf",
  description: turf.description || "",
  location: {
    address: turf.location?.address || "Not Provided",
    city: turf.location?.city || "Not Provided",
    state: turf.location?.state || "",
    coordinates: turf.location?.coordinates || {
      type: "Point",
      coordinates: [0, 0],
    },
  },
  courtType: turf.courtType || "Not specified",
  status: turf.status === "active" ? "active" : "inactive",
  createdAt: turf.createdAt ? new Date(turf.createdAt) : new Date(),
  pricePerHour: turf.pricePerHour || "Not Provided",
  amenities: turf.amenities || [],
  images: turf.images || [],
  contactNumber: turf.contactNumber || "N/A",
}));


      return {
        success: response.success,
        users: turfs,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        message: response.message,
      };
    } catch (error) {
      console.error("Failed to fetch turfs", error);
      return {
        success: false,
        users: [],
        totalPages: 0,
        currentPage: 1,
        message: "Failed to fetch turfs",
      };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-900/30 text-green-400 border border-green-500/30";
      case "rejected":
        return "bg-red-900/30 text-red-400 border border-red-500/30";
      case "pending":
        return "bg-gray-900/30 text-gray-400 border border-gray-500/30";
    }
  };

  const handleStatusChange = async (turfId: string, newStatus: turfStatus) => {
    try {
      const res = await adminService.updateEntityStatuss(
        "turf",
        turfId,
        newStatus
      );

      if (res.success) {
        toast.success(`Turf status updated to ${newStatus}`);
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error(`Failed to update turf status: ${res.message}`);
      }
    } catch (error) {
      console.error("Error while updating turf status:", error);
      toast.error("Error updating turf status. Please try again later");
    }
  };

  const handleRejectClick = (turfId: string) => {
    setSelectedTurfId(turfId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!selectedTurfId) return;

    try {
      setIsSubmittingReject(true);
      const res = await adminService.updateEntityStatus(
        "turf",
        selectedTurfId,
        "rejected",
        reason
      );

      if (res.success) {
        toast.success("Turf rejected successfully");
        setShowRejectModal(false);
        setSelectedTurfId(null);
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error(`Failed to reject turf: ${res.message}`);
      }
    } catch (error) {
      console.error("Error while rejecting turf:", error);
      toast.error("Error rejecting turf. Please try again later");
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedTurfId(null);
  };

  const columns: TableColumn<Turf>[] = [
    {
      key: "turfName",
      label: "Turf Name",
      width: "col-span-3",
      render: (turf) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <MapPin className="text-gray-400" size={16} />
          </div>
          <span className="font-medium truncate text-sm">{turf.name}</span>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      width: "col-span-3",
      render: (turf) => (
        <span className="text-sm text-gray-300 truncate">{turf.location}</span>
      ),
    },
    {
      key: "courtType",
      label: "Court Type",
      width: "col-span-2",
      render: (turf) => (
        <span className="text-sm text-gray-400">{turf.courtType}</span>
      ),
    },
    {
      key: "pricePerHour",
      label: "Price / Hour",
      width: "col-span-2",
      render: (turf) => (
        <span className="text-sm text-gray-400">₹{turf.pricePerHour}</span>
      ),
    },
    {
      key: "amenities",
      label: "Amenities",
      width: "col-span-3",
      render: (turf) =>
        turf.amenities.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {turf.amenities.slice(0, 3).map((am, i) => (
              <span
                key={i}
                className="bg-gray-700/40 px-2 py-0.5 rounded-full text-xs text-gray-300"
              >
                {am}
              </span>
            ))}
            {turf.amenities.length > 3 && (
              <span className="text-xs text-gray-400">
                +{turf.amenities.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-500">No amenities</span>
        ),
    },
    {
      key: "images",
      label: "Images",
      width: "col-span-2",
      render: (turf) =>
        turf.images.length > 0 ? (
          <div className="flex gap-1">
            {turf.images.slice(0, 2).map((img, i) => (
              <img
                key={i}
                src={img}
                alt="turf"
                className="w-8 h-8 rounded object-cover border border-gray-700"
              />
            ))}
            {turf.images.length > 2 && (
              <span className="text-xs text-gray-400">
                +{turf.images.length - 2} more
              </span>
            )}
          </div>
        ) : (
          <ImageIcon className="text-gray-500" size={16} />
        ),
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-2",
      render: (turf) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            turf.status
          )}`}
        >
          {turf.status}
        </span>
      ),
    },
  ];

  const actions: TableAction<Turf>[] = [
    {
      label: "Approve",
      icon: <Check size={12} />,
      onClick: (turf) => handleStatusChange(turf._id, "approved"),
      condition: (turf) => turf.status !== "approved",
      variant: "success",
      refreshAfter: true,
    },
    {
      label: "Reject",
      icon: <X size={12} />,
      onClick: (turf) => handleRejectClick(turf._id),
      condition: (turf) => turf.status !== "rejected",
      variant: "danger",
      refreshAfter: true,
    },
  ];

  return (
    <>
      <GenericTable<Turf>
        key={refreshKey}
        title="Turf Verification"
        columns={columns}
        actions={actions}
        fetchData={fetchTurfs}
        searchPlaceholder="Search turfs.."
        itemsPerPage={5}
        enableSearch
        enablePagination
        enableActions
        emptyMessage="No turfs found matching your criteria"
        loadingMessage="Loading turfs list..."
      />

      <RejectionModal
        isOpen={showRejectModal}
        onClose={closeRejectModal}
        onSubmit={handleRejectSubmit}
        title="Reject Turf"
        description="Please select a reason for rejecting this turf"
        predefinedReasons={turfRejectionReasons}
        isSubmitting={isSubmittingReject}
      />
    </>
  );
}
