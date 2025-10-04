import { GenericTable } from "@/components/ReusableComponents/GenericTable";
import type { TableRef } from "@/components/ReusableComponents/GenericTable";

import { adminService } from "@/services/admin/adminService";
import type { ApiResponse, FetchParams } from "@/types/api.type";
import type {
  ExtendableItem,
  TableAction,
  TableColumn,
  TableFilter,
} from "@/types/table_type";
import type { ITurfOwner } from "@/types/User";
import { User } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

type OwnerStatus = "approved" | "rejected" | "pending" | "blocked" | "active";
interface OwnerData extends ExtendableItem {
  _id: string;
  username: string;
  status: OwnerStatus;
  email: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  createdAt?: string;
}

export default function OwnerManagement() {
  const [activeFilter, setActiveFilter] = useState<OwnerStatus | "all">("all");
  const [selectedOwner, setSelectedOwner] = useState<OwnerData | null>(null);
  const tableRef = useRef<TableRef<OwnerData>>(null);

  const fetchOwners = async (
    params: FetchParams<{}>
  ): Promise<ApiResponse<OwnerData>> => {
    try {
      const response = await adminService.getAllUSers({
        role: "turfOwner",
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: activeFilter === "all" ? undefined : activeFilter,
        excludeStatus: "pending",
      });
      const turfOwners: OwnerData[] = (response.users as ITurfOwner[]).map(
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
      if (response.success) {
        return {
          success: true,
          users: turfOwners,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItem: response.users.length,
        };
      } else {
        return {
          success: false,
          users: [],
          currentPage: 1,
          totalPages: 0,
          message: "An error occured while fetching owners",
        };
      }
    } catch (error) {
      return {
        success: false,
        users: [],
        currentPage: 1,
        totalPages: 0,
        message: "An error occured while fetching owners",
      };
    }
  };

  const changeOwnerStatus = async (ownerId: string, newStatus: OwnerStatus) => {
    try {
      const response = await adminService.updateEntityStatus(
        "turfOwner",
        ownerId,
        newStatus
      );
      if (response.success) {
        tableRef.current?.updateItemOptimistically(ownerId, {
          status: newStatus,
        });
        toast.success(`owner status updated to ${newStatus}`);
      } else {
        toast.error(response.message || "Failed to update owner status");
      }
    } catch (error) {
      console.error("status updated failed", error);
    }
  };
  const columns: TableColumn<OwnerData>[] = [
    {
      key: "turfOwner",
      label: "turfOwner",
      width: "col-span-4 md:col-span-2",
      render: (owner: OwnerData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
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
      render: (owner: OwnerData) => (
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
      render: (owner: OwnerData) => (
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
      render: (owner: OwnerData) => {
        const getStatusColor = (status: OwnerStatus) => {
          switch (status) {
            case "approved":
              return "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30";
            case "rejected":
              return "bg-red-900/30 text-red-400 border border-red-500/30";
            case "pending":
              return "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30";
            case "blocked":
              return "bg-purple-900/30 text-purple-400 border border-purple-500/30";
            default:
              return "bg-gray-900/30 text-gray-400 border border-gray-500/30";
          }
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              owner.status
            )}`}
          >
            {owner.status}
          </span>
        );
      },
    },
  ];
  const actions: TableAction<OwnerData>[] = [
    {
      label: "Approve",
      onClick: (owner: OwnerData) => changeOwnerStatus(owner._id, "approved"),
      condition: (owner: OwnerData) => owner.status !== "approved",
      variant: "success",
      seperator: true,
      refreshAfter: false,
    },
    {
      label: "Reject",
      onClick: (owner: OwnerData) => changeOwnerStatus(owner._id, "rejected"),
      condition: (owner: OwnerData) =>
        owner.status !== "rejected" && owner.status !== "approved",
      variant: "warning",
      refreshAfter: false,
    },
    {
      label: "Block",
      onClick: (owner: OwnerData) => changeOwnerStatus(owner._id, "blocked"),
      condition: (owner: OwnerData) =>
        owner.status !== "blocked" && owner.status === "approved",
      variant: "warning",
      refreshAfter: false,
    },
  ];

  const filters: TableFilter[] = [
    { key: "all", label: "All", value: "all" },
    { key: "approved", label: "Approved", value: "approved" },
    { key: "rejected", label: "Rejected", value: "rejected" },
    { key: "blocked", label: "Blocked", value: "blocked" },
  ];

  const handleFilterChange = (filterValue: string) => {
    setActiveFilter(filterValue as OwnerStatus | "all");
  };
  return (
    <>
      <GenericTable<OwnerData>
        ref={tableRef}
        title="Owner Management"
        columns={columns}
        actions={actions}
        filters={filters}
        searchPlaceholder="Search Owners..."
        itemsPerPage={4}
        enableSearch={true}
        enablePagination={true}
        enableActions={true}
        emptyMessage="No owners found matching your criteria.."
        loadingMessage="Loading Owners.."
        fetchData={fetchOwners}
        onFilterChange={handleFilterChange}
        className="max-w-6xl"
      />
    </>
  );
}
