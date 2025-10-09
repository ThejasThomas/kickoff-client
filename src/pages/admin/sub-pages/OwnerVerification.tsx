import { GenericTable } from "@/components/ReusableComponents/GenericTable";
import RejectionModal from "@/components/ReusableComponents/RejectionModal";
import { ConfirmationModal } from "@/components/ReusableComponents/ConfirmationModel";
import type { TableRef } from "@/components/ReusableComponents/GenericTable";
import { adminService } from "@/services/admin/adminService";
import type { ApiResponse, FetchParams } from "@/types/api.type";
import type {
  ExtendableItem,
  TableAction,
  TableColumn,
} from "@/types/table_type";
import type { ITurfOwner } from "@/types/User";
import { Check, User, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface TurfOwner extends ExtendableItem {
  _id: string;
  username: string;
  email: string;
  status: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  createdAt: string;
}

type ownerStatus = "approved" | "rejected" | "pending";

export default function VendorVerification() {
  const tableRef = useRef<TableRef<TurfOwner>>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedForApprove, setSelectedForApprove] =
    useState<TurfOwner | null>(null);

  const ownerRejectionReasons = ["Incomplete or uncleared documentation"];

  const fetchOwners = async (
    params: FetchParams<{}>
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
          _id: user._id,
          username: user.ownerName || "Unknown Owner",
          email: user.email,
          phoneNumber: user.phoneNumber || "N/A",
          address: user.address || "N/A",
          city: user.city || "N/A",
          status: user.status || "pending",
          createdAt: user.createdAt?.toString() || new Date().toISOString(),
        })
      );

      return {
        success: response.success,
        users: turfOwners,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        message: response.message,
        totalItem: response.users.length,
      };
    } catch (error) {
      console.error("Failed to fetch turfOwners", error);
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
        return "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30";
      case "rejected":
        return "bg-red-900/30 text-red-400 border border-red-500/30";
      case "pending":
        return "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30";
      default:
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
        tableRef.current?.updateItemOptimistically(ownerId, {
          status: newStatus,
        });
        toast.success(`Owner status updated to ${newStatus}`);
      } else {
        console.error("Failed to update status", res.message);
        toast.error(
          `Failed to update owner status: ${res.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error while updating owner status:", error);
      toast.error("Error updating owner status. Please try again later");
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
        tableRef.current?.updateItemOptimistically(selectedOwnerId, {
          status: "rejected",
        });
        toast.success("Owner rejected successfully");
        setShowRejectModal(false);
        setSelectedOwnerId(null);
      } else {
        toast.error(`Failed to reject owner: ${res.message || "unknown error"}`);
        throw new Error(res.message || "Failed to reject owner");
      }
    } catch (error) {
      console.error("Error while rejecting owner:", error);
      toast.error("Error rejecting owner. Please try again later");
      throw error;
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedOwnerId(null);
  };

  const handleApproveClick = (owner: TurfOwner) => {
    setSelectedForApprove(owner);
    setShowApproveModal(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedForApprove) return;
    await handleStatusChange(selectedForApprove._id, "approved");
    setShowApproveModal(false);
    setSelectedForApprove(null);
  };

  const closeApproveModal = () => {
    setShowApproveModal(false);
    setSelectedForApprove(null);
  };

  const columns: TableColumn<TurfOwner>[] = [
    {
      key: "owner",
      label: "Owner",
      width: "col-span-4 md:col-span-2",
      render: (owner) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="text-gray-400" size={20} />
          </div>
          <span className="font-medium truncate">{owner.username}</span>
        </div>
      ),
    },
    {
      key: "address",
      label: "Address",
      width: "col-span-4 md:col-span-2",
      render: (owner: TurfOwner) => (
        <div className="text-sm">
          <div className="text-white truncate">{owner.address}</div>
          <div className="text-gray-400 text-xs">{owner.city}</div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      width: "col-span-4 md:col-span-2",
      render: (owner: TurfOwner) => (
        <div className="text-sm">
          <div className="text-white truncate">{owner.email}</div>
          <div className="text-gray-400 text-xs">{owner.phoneNumber}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-4 md:col-span-2",
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
      onClick: (owner) => handleApproveClick(owner),
      condition: (owner) => owner.status !== "approved",
      variant: "success",
      refreshAfter: false,
    },
    {
      label: "Reject",
      icon: <X size={12} />,
      onClick: (owner) => handleRejectClick(owner._id),
      condition: (owner) => owner.status !== "rejected",
      variant: "danger",
      refreshAfter: false,
    },
  ];

  return (
    <>
      <GenericTable<TurfOwner>
        ref={tableRef}
        title="Owner Verification"
        columns={columns}
        actions={actions}
        fetchData={fetchOwners}
        searchPlaceholder="Search owners.."
        itemsPerPage={5}
        enableSearch={true}
        enablePagination={true}
        enableActions={true}
        emptyMessage="No owners found matching your criteria"
        loadingMessage="Loading owners list"
      />

      <RejectionModal
        isOpen={showRejectModal}
        onClose={closeRejectModal}
        onSubmit={handleRejectSubmit}
        title="Reject Owner"
        description="Please select a reason for rejecting this owner"
        predefinedReasons={ownerRejectionReasons}
        isSubmitting={isSubmittingReject}
      />

      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={closeApproveModal}
        onConfirm={handleApproveConfirm}
        title="Approve Owner"
        message={`Are you sure you want to approve ${selectedForApprove?.username}? This action cannot be undone.`}
        confirmText="Approve"
        cancelText="Cancel"
        variant="success"
      />
    </>
  );
}