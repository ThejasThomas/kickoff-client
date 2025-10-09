import {ConfirmationModal} from "@/components/ReusableComponents/ConfirmationModel";
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
import { Shield, User } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface Users extends ExtendableItem {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "active" | "blocked";
}

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [pendingStatus, setPendingStatus] = useState<"active" | "blocked" | null>(null);

  const tableRef = useRef<TableRef<Users>>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const columns: TableColumn<Users>[] = [
    {
      key: "user",
      label: "User",
      width: "col-span-4 md:col-span-3",
      render: (user: Users) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            <User className="text-gray-400" size={20} />
          </div>
          <span className="font-medium truncate">{user.fullName}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      width: "col-span-4 md:col-span-3",
      responsive: "hidden",
      render: (user) => (
        <span className="text-gray-300 truncate">{user.email}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      width: "col-span-3",
      responsive: "hidden",
      render: (user) => (
        <span className="text-gray-300">{user.phone || "N/A"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-4 md:col-span-2",
      render: (user) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.status === "active"
              ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30"
              : "bg-red-900/30 text-red-400 border border-red-500/30"
          }`}
        >
          {user.status}
        </span>
      ),
    },
  ];

  const actions: TableAction<Users>[] = [
    {
      label: (user) =>
        user.status === "active" ? "Block User" : "Unblock User",
      icon: <Shield size={16} />,
      onClick: async (user) => {
        const newStatus = user.status === "active" ? "blocked" : "active";
        setSelectedUser(user);
        setPendingStatus(newStatus);
        setShowModal(true);
      },
      refreshAfter: false,
      variant: "danger",
      condition: () => true,
    },
  ];

  const filters: TableFilter[] = [
    { key: "all", label: "All", value: "all" },
    { key: "active", label: "Active", value: "active" },
    { key: "blocked", label: "Blocked", value: "blocked" },
  ];

  const fetchUsers = async (
    params: FetchParams<{}>
  ): Promise<ApiResponse<Users>> => {
    try {
      const response = await adminService.getAllUSers({
        role: "client",
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: activeFilter === "all" ? undefined : activeFilter,
      });

      const users: Users[] = response.users.map((user: any) => ({
        _id: user._id,
        fullName: user.fullName || user.name || "Unknown User",
        email: user.email,
        phone: user.phone || user.phoneNumber || "",
        status: user.status === "blocked" ? "blocked" : "active",
      }));

      return {
        success: response.success,
        users: users,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItem: users.length,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        users: [],
        totalPages: 0,
        currentPage: 1,
        totalItem: 0,
      };
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser || !pendingStatus) return;

    try {
      const response = await adminService.updateEntityStatus(
        "client",
        selectedUser._id,
        pendingStatus
      );
      if (response.success) {
        tableRef.current?.updateItemOptimistically(selectedUser._id, {
          status: pendingStatus,
        });
        toast.success(
          `User ${
            pendingStatus === "active" ? "unblocked" : "blocked"
          } successfully`
        );
      } else {
        toast.error(response.message || "Failed to update user status");
      }
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Status update error:", error);
    }
  };

  return (
    <>
      <GenericTable<Users>
        ref={tableRef}
        title="User Management"
        columns={columns}
        actions={actions}
        filters={filters}
        searchPlaceholder="Search users..."
        itemsPerPage={2}
        fetchData={fetchUsers}
        emptyMessage="No users found matching your criteria..."
        loadingMessage="Loading Users..."
        onFilterChange={(val) => setActiveFilter(val)}
        enableSearch={true}
        enablePagination={true}
        enableActions={true}
      />
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatus === "active" ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${pendingStatus === "active" ? "unblock" : "block"} ${selectedUser?.fullName}? This action cannot be undone.`}
        confirmText={pendingStatus === "active" ? "Unblock" : "Block"}
        variant="danger"
      />
    </>
  );
}