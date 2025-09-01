import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

// 🔹 Type for items
interface SidebarItemType {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface SidebarProps {
  isVisible?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  handleLogout?: () => void;
  className?: string;
  role?: "admin" | "client" | "turfOwner";
  sidebarItems?: SidebarItemType[]; // required
  title?: string;
  showLogoutButton?: boolean;
}

interface NavItemProps {
  item: SidebarItemType;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem = ({ item, isActive, onClick }: NavItemProps) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-[var(--yellow)] text-black font-medium"
          : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{item.label}</span>
    </Link>
  );
};

export function Sidebar({
  isVisible,
  isOpen,
  onClose,
  handleLogout,
  className,
  sidebarItems,
  title = "Menu",
  showLogoutButton = true,
}: SidebarProps) {
  const location = useLocation();

  const sidebarOpen = isVisible ?? isOpen ?? false;

  const items = sidebarItems ?? [];
  // determine active item
  const activeIndex = items.findIndex((item) =>
  location.pathname.startsWith(item.path)
)

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
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed left-0 top-0 z-50 h-full w-64 bg-[#1a1a1a] border-r border-gray-800",
              "lg:relative lg:translate-x-0",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-1 px-3 overflow-y-auto">
              <div className="space-y-1 py-2">
                {items.map((item, index) => (
                  <SidebarItem
                    key={`${item.path}-${index}`}
                    item={item}
                    isActive={index === activeIndex}
                    onClick={onClose}
                  />
                ))}
              </div>
            </nav>

            {/* Logout Button */}
            {showLogoutButton && handleLogout && (
              <div className="p-3 border-t border-gray-800">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                  onClick={() => {
                    handleLogout();
                    onClose();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
