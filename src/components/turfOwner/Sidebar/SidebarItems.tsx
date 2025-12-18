import {
  Calendar,
  CircleQuestionMark,
  ClipboardList,
  DollarSign,
  PlusCircle,
  Shield,
} from "lucide-react";

export const sidebarItems = [
  { icon: DollarSign, label: "Earnings", path: "/turfOwner/owner-earnings" },
  { icon: PlusCircle, label: "Add Turf", path: "/turfOwner/add-turf" },
  { icon: PlusCircle, label: "My Turfs", path: "/turfOwner/my-turf" },
  {
    icon: CircleQuestionMark,
    label: "Turfs Reapply",
    path: "/turfOwner/re-apply-turf",
  },
  { icon: Calendar, label: "Add Slots", path: "/turfOwner/add-slots" },
  { icon: ClipboardList, label: "Bookings", path: "/turfOwner/turfsbooking" },
  {
    icon: PlusCircle,
    label: "Cancel Requests",
    path: "/turfOwner/cancel-booking-requests",
  },
  {
    icon: Shield,
    label: "Wallet",
    path: "/turfOwner/wallet",
  },
];
