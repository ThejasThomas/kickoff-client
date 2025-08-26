import { AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserCheck,
  Shield,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  route: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", route: "/admin/dashboard" },
  { icon: Users, label: "Clients", route: "/admin/users-management" },
  { icon: UserCheck, label: "Owners", route: "/admin/owner-management" },
  {
    icon: Shield,
    label: "Owners Verification",
    route: "/admin/owner-verification",
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(
      (item) => item.route === location.pathname
    );
    return currentItem?.label || "Dashboard";
  };

  const handleSidebarNavigation = (route: string) => {
    if (!route) return;
    navigate(route);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-800 rounded-md shadow-md text-gray-300 border border-gray-700"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed md:relative z-20 w-64 h-full bg-gray-800 shadow-lg md:shadow-none border-r border-gray-700 ${
              sidebarOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-8">
                <h1
                  className="text-2xl font-bold text-orange-400"
                  style={{ color: "#f69938" }}
                >
                  AdminPanel
                </h1>
              </div>
              <nav>
                <ul className="space-y-2">
                  {sidebarItems.map((item, index) => {
                    const isActive = location.pathname === item.route;
                    const IconComponent = item.icon;
                    return (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <button
                          onClick={() => handleSidebarNavigation(item.route)}
                          className={`w-full flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:shadow-lg transition-all duration-200 ${
                            isActive
                              ? "bg-orange-500 text-black font-medium shadow-lg shadow-orange-500/30"
                              : ""
                          }`}
                          style={isActive ? { backgroundColor: "#f69938" } : {}}
                        >
                          <IconComponent
                            className={`w-5 h-5 mr-3 ${
                              isActive ? "text-black" : "text-gray-400"
                            }`}
                          />
                          <span>{item.label}</span>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
