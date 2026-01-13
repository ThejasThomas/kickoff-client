import type { AdminDashboardEntity } from "@/types/adminDashboard_type";
import { COLORS } from "./utils";

export const getUsersChartData = (data: AdminDashboardEntity) => [
  { name: "Active", value: data.users.active, color: COLORS.success },
  { name: "Blocked", value: data.users.blocked, color: COLORS.danger },
  { name: "Pending", value: data.users.pending, color: COLORS.warning },
];

export const getTurfsChartData = (data: AdminDashboardEntity) => [
  { name: "Approved", value: data.turfs.approved, color: COLORS.success },
  { name: "Pending", value: data.turfs.pending, color: COLORS.warning },
  { name: "Rejected", value: data.turfs.rejected, color: COLORS.danger },
];

export const getOwnersChartData = (data: AdminDashboardEntity) => [
  { name: "Active", value: data.owners.active, color: COLORS.success },
  { name: "Blocked", value: data.owners.blocked, color: COLORS.danger },
  { name: "Pending", value: data.owners.pending, color: COLORS.warning },
];

export const getBookingsChartData = (data: AdminDashboardEntity) => [
  { name: "Completed", value: data.bookings.completed },
  { name: "Confirmed", value: data.bookings.confirmed },
  { name: "Cancelled", value: data.bookings.cancelled },

];