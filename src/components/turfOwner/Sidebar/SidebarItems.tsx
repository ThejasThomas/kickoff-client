import { Calendar, ClipboardList, DollarSign, PlusCircle } from "lucide-react";

export const sidebarItems = [
  { icon: DollarSign, label: "Earnings", path: "/turfOwner/earnings" },
  { icon: PlusCircle, label: "Add Turf", path: "/turfOwner/add-turf" },
  { icon: PlusCircle, label: "My Turfs", path: "/turfOwner/my-turf" },
  { icon: Calendar, label: "Add Slots", path: "/turfOwner/add-slots" },
  { icon: ClipboardList, label: "Bookings", path: "/turfOwner/bookings" },
];