
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LogOut,
  Home,
  MapPin,
  Calendar,
  Clock,
  User,
  Trophy,
  Star,
  X,
  Wallet,
  Footprints,
  Group,
} from "lucide-react";
import { Button } from "../ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"

interface SidebarItemType {
  icon: React.ElementType;
  label: string;
  path: string;
  description?: string;
}

interface SidebarProps {
  isVisible?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  handleLogout?: () => void;
  className?: string;
  role?: "admin" | "client" | "turfOwner";
  sidebarItems?: SidebarItemType[];
  title?: string;
  showLogoutButton?: boolean;
}

interface NavItemProps {
  item: SidebarItemType;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const getDefaultSidebarItems = (role: string): SidebarItemType[] => {
  switch (role) {
    case "client":
      return [
        {
          icon: Home,
          label: "Dashboard",
          path: "/home",
          description: "Overview & Stats",
        },
        {
          icon: Calendar,
          label: "My Bookings",
          path: "/upcomingbookings",
          description: "Manage Reservations",
        },
        {
          icon: Clock,
          label: "Booking History",
          path: "/bookinghistory",
          description: "Past Activities",
        },
        {
          icon: Footprints,
          label: "Hosted Games",
          path: "/hosted-games",
          description: "Hosted Games",
        },
        {
          icon: Wallet,
          label: "Wallet",
          path: "/wallet",
          description: "Wallet details",
        },
        {
          icon:Group,
          label:"ChatGroups",
          path:"/chatGroups",
          description:"Chat Groups"
        }
      ];
    case "admin":
      return [
        {
          icon: Home,
          label: "Dashboard",
          path: "/admin/dashboard",
          description: "Admin Overview",
        },
        {
          icon: MapPin,
          label: "Manage Turfs",
          path: "/admin/turfs",
          description: "Turf Management",
        },
        {
          icon: User,
          label: "Users",
          path: "/admin/users",
          description: "User Management",
        },
      ];
    case "turfOwner":
      return [
        {
          icon: Home,
          label: "Dashboard",
          path: "/turf-owner/dashboard",
          description: "Owner Dashboard",
        },
        {
          icon: MapPin,
          label: "My Turfs",
          path: "/turf-owner/turfs",
          description: "Manage Your Turfs",
        },
        {
          icon: Calendar,
          label: "Bookings",
          path: "/turf-owner/bookings",
          description: "Booking Management",
        },
      ];
    default:
      return [];
  }
};

const SidebarItem = ({ item, isActive, onClick, index }: NavItemProps) => {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
    >
      <Link
        to={item.path}
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 overflow-hidden",
          isActive
            ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:shadow-xl"
            : "text-gray-300 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-blue-500/10 hover:text-white"
        )}
        onClick={onClick}
      >
        {/* Background glow effect */}
        {isActive && (
          <motion.div
            layoutId="activeBackground"
            className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Icon container */}
        <div
          className={cn(
            "relative z-10 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
            isActive
              ? "bg-white/20 shadow-inner"
              : "bg-gray-700/50 group-hover:bg-emerald-500/20"
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isActive
                ? "text-white"
                : "text-gray-400 group-hover:text-emerald-400"
            )}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 min-w-0">
          <p
            className={cn(
              "font-semibold transition-colors duration-300 truncate",
              isActive ? "text-white" : "text-gray-300 group-hover:text-white"
            )}
          >
            {item.label}
          </p>
          {item.description && (
            <p
              className={cn(
                "text-xs transition-colors duration-300 truncate",
                isActive
                  ? "text-white/80"
                  : "text-gray-500 group-hover:text-gray-300"
              )}
            >
              {item.description}
            </p>
          )}
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export function Sidebar({
  isVisible,
  isOpen,
  onClose,
  handleLogout,
  className,
  role = "client",
  sidebarItems,
  title = "KickOff Arena",
  showLogoutButton = true,
}: SidebarProps) {
  const location = useLocation();

  const sidebarOpen = isVisible ?? isOpen ?? false;
  const items = sidebarItems ?? getDefaultSidebarItems(role);

  // Determine active item
  const activeIndex = items.findIndex((item) =>
    location.pathname.startsWith(item.path)
  );

  // const getUserInitials = (name: string) => {
  //   return (
  //     name
  //       ?.split(" ")
  //       .map((n) => n[0])
  //       .join("")
  //       .toUpperCase() || "U"
  //   );
  // };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Always Fixed Position */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 shadow-2xl",
              className
            )}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    {title}
                  </h2>
                  <p className="text-xs text-gray-400">Premium Turf Booking</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* User Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              {/* <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-emerald-400/50">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold">
                      {getUserInitials("User Name")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">Welcome Back!</p>

                </div>
              </div> */}
            </motion.div>

            {/* Navigation */}
            <nav className="flex-1 px-6 overflow-y-auto">
              <div className="space-y-2">
                {/* <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Navigation
                  </span>
                </div> */}

                {items.map((item, index) => (
                  <SidebarItem
                    key={`${item.path}-${index}`}
                    item={item}
                    isActive={index === activeIndex}
                    onClick={onClose}
                    index={index}
                  />
                ))}
              </div>
            </nav>

            {/* Logout Button */}
            {showLogoutButton && handleLogout && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 border-t border-gray-700/50 bg-gradient-to-r from-red-500/5 to-orange-500/5"
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl p-4 transition-all duration-300 group"
                  onClick={() => {
                    handleLogout();
                    onClose();
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center mr-3 transition-all duration-300">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Sign Out</p>
                    <p className="text-xs opacity-70">Logout from account</p>
                  </div>
                </Button>
              </motion.div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
