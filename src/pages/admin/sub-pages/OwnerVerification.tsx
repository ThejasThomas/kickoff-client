import { GenericTable } from "@/components/ReusableComponents/GenericTable";
import RejectionModal from "@/components/ReusableComponents/RejectionModal";
import { adminService } from "@/services/admin/adminService";
import type { ApiResponse, FetchParams } from "@/types/api.type";
import type {
  ExtendableItem,
  TableAction,
  TableColumn,
} from "@/types/table_type";
import type { ITurfOwner } from "@/types/User";
import { Check, User, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
interface TurfOwner extends ExtendableItem {
  _id: string;
  username: string;
  email: string;
  status: string;
  createdAt: string;
}
type ownerStatus = "approved" | "rejected" | "pending";

export default function VendorVerification() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  const ownerRejectionReasons = ["Incomplete or uncleared documentation"];

  const fetchOwners = async (
    params: FetchParams
  ): Promise<ApiResponse<TurfOwner>> => {
    try {
      const response = await adminService.getAllUSers({
        role: "turfOwner",
        page: params.page,
        limit: params.limit,
        search: params.search,
        excludeStatus: ["approved", "rejected", "blocked"],
      });
      const turfOwners: TurfOwner[] = (response.users as ITurfOwner[]).map(
        (user) => ({
          _id: user.userId,
          username: user.ownerName|| 'Unknown Owner',
          email: user.email,
          status: user.status || 'pending',
          createdAt: user.createdAt?.toString() || new Date().toISOString()
        })
      );

      return {
        success: response.success,
        users: turfOwners,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        message: response.message,
      };
    } catch (error) {
      console.error("Failed to fetch venders", error);
      return {
        success: false,
        users: [],
        totalPages: 0,
        currentPage: 1,
        message: "Failed to fetch turfOwners",
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

  const handleStatusChange = async (
    ownerId: string,
    newStatus: ownerStatus
  ) => {
    try {
      const res = await adminService.updateEntityStatus(
        "turfOwner",
        ownerId,
        newStatus
      );
      if (res.success) {
        toast.success(`ownwer status updated to ${newStatus}`);
        setRefreshKey((prev) => prev + 1);
      } else {
        console.error("Failed to update status", res.message);
        toast.error(
          `Failed to update vendor status:${res.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error while updating uwner status:", error);
      toast.error("Error updating owner status.Please try again later");
    }
  };

  const handleRejectClick = (ownerId: string) => {
    setSelectedOwnerId(ownerId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!selectedOwnerId) return;

    try {
      setIsSubmittingReject(true);
      const res = await adminService.updateEntityStatus(
        "turfOwner",
        selectedOwnerId,
        "rejected",
        reason
      );

      if (res.success) {
        toast.success("Vendor rejected successfully");
        setShowRejectModal(false);
        setSelectedOwnerId(null);
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error(`Failed to reject owner:${res.message || "unknown error"}`);
        throw new Error(res.message || "Failed to reject owner");
      }
    } catch (error) {
      console.error("Errroer while rejectiong owner:", error);
      toast.error("Error rejectiong owner.Please try again later");
      throw error;
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedOwnerId(null);
  };

  const columns: TableColumn<TurfOwner>[] = [
    {
      key: "owner",
      label: "owner",
      width: "col-span-2",
      render: (owner) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="text-gray-400" size={16} />
          </div>
          <span className="font-medium truncate text-sm">{owner.username}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-1",
      render: (owner) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            owner.status
          )}`}
        >
          {owner.status}
        </span>
      ),
    },
  ];

  const actions: TableAction<TurfOwner>[] = [
    {
      label: "Approve",
      icon: <Check size={12} />,
      onClick: (owner) => handleStatusChange(owner._id, "approved"),
      condition: (owner) => owner.status !== "approved",
      variant: "success",
      refreshAfter: true,
    },
    {
      label: "Reject",
      icon: <X size={12} />,
      onClick: (owner) => handleRejectClick(owner._id),
      condition: (owner) => owner.status !== "rejected",
      variant: "danger",
      refreshAfter: true,
    },
  ];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <GenericTable<TurfOwner>
        key={refreshKey}
        title="Owner verification"
        columns={columns}
        actions={actions}
        fetchData={fetchOwners}
        onRefresh={handleRefresh}
        searchPlaceholder="Search vendors.."
        itemsPerPage={5}
        enableSearch={true}
        enablePagination={true}
        enableActions={true}
        emptyMessage="No owners found matching your criteria"
        loadingMessage="Loading owners list"
        />

        <RejectionModal
        isOpen ={showRejectModal}
        onClose={closeRejectModal}
        onSubmit={handleRejectSubmit}
        title="Reject Owner"
        description="Please select a reason for rejecting this owner"
        predefinedReasons={ownerRejectionReasons}
        isSubmitting={isSubmittingReject}
        />

    </>
  )
}
