import type { IAdmin, IClient, ITurfOwner, UserDTO } from "@/types/User";
import { Tooltip } from "@mui/material";
import { LogOut, Menu, User as UserIcon, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/drop-down-menu";
import logo from "../../assets/logo.png";
import { ConfirmationModal } from "@/components/ReusableComponents/ConfirmationModel";
import { useState } from "react";

interface CustomAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

interface HeaderProps {
  user: UserDTO | null;
  onSidebarToggle?: () => void;
  onLogout: () => void;
  className?: string;
  backgroundClass?: string;
  
  customActions?: CustomAction[];
  showProfile?: boolean;
  showSettings?: boolean;
  brandName?: string;
  brandLogo?: string;
}

export function PrivateHeader({
  user,
  onSidebarToggle,
  onLogout,
  className = '',
  backgroundClass = 'bg-black',
  customActions = [],
  showProfile = true,
  showSettings = true,
  brandName = 'KickOFF',
  brandLogo = logo,
}: HeaderProps) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isClient = user?.role === "client";
  const isTurfOwner = user?.role === "turfOwner";
  const isAdmin = user?.role === "admin";

  const displayName = isTurfOwner
    ? (user as ITurfOwner)?.ownerName
    : (user as IClient | IAdmin)?.fullName || "User";

  const handleProfileClick = () => {
    const profileRoutes = {
      client: 'clientprofile',
      turfOwner: '/turfOwner/profile',
      admin: '/admin/profile'
    };
    navigate(profileRoutes[user?.role || 'client']);
  };

  // const handleSettingsClick = () => {
  //   const settingsRoutes = {
  //     client: '/client/settings',
  //     turfOwner: '/turfOwner/settings',
  //     admin: '/admin/settings'
  //   };
  //   navigate(settingsRoutes[user?.role || 'client']);
  // };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    onLogout();
    setShowLogoutModal(false);
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className={`flex items-center justify-between px-4 py-2 ${backgroundClass} ${className}`}>
        {/* Left section: Sidebar toggle + Logo */}
        <div className="flex items-center">
          {onSidebarToggle && (
            <Tooltip title="Toggle sidebar" arrow placement="bottom">
              <Button
                onClick={onSidebarToggle}
                className="min-w-[auto] p-2 text-white hover:bg-white/10 transition-colors [&_svg]:m-0"
                variant="ghost"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </Tooltip>
          )}

          {/* Logo */}
          <div className="ml-2 mr-8 flex items-center space-x-2">
            <img src={brandLogo} alt="Logo" className="w-7 h-7" />
            <span className="text-xl font-young text-white hover:text-gray-300 transition-colors">
              {brandName}
            </span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Custom Actions */}
          {customActions.map((action) => (
            <Tooltip key={action.id} title={action.label} arrow placement="bottom">
              <Button
                onClick={action.onClick}
                className={`p-2 text-white hover:bg-white/10 transition-colors ${action.className || ''}`}
                variant="ghost"
              >
                {action.icon}
              </Button>
            </Tooltip>
          ))}

          {/* User Menu */}
          {(isClient || isTurfOwner || isAdmin) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white hover:bg-white/10 transition-colors px-3"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-gray-300 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-48">
                {/* User Info Header */}
                <div className="px-3 py-2 border-b">
                  <p className="font-medium text-sm">{displayName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>

                {/* Profile */}
                {showProfile && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleProfileClick}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                )}

                {/* Settings */}
                {/* {showSettings && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleSettingsClick}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                )} */}

                {(showProfile || showSettings) && <DropdownMenuSeparator />}

                {/* Logout */}
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 hover:text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-500"
                  onClick={handleLogoutClick}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will be redirected to the login page."
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}