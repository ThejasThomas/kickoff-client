import { useLogout } from "@/hooks/auth/useLogout";
import { useToaster } from "@/hooks/ui/useToaster";
import { turfOwnerLogout } from "@/store/slices/turfOwner_slice"; // Use correct action
import type { RootState } from "@/store/store";
import type React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PrivateHeader } from "../mainComponents/PrivateHeader";
import { Sidebar } from "../mainComponents/Sidebar";
import { sidebarItems } from "../turfOwner/Sidebar/SidebarItems";
import { logoutTurfOwner } from "@/services/auth/authService";

interface TurfOwnerLayoutProps {
  title?: string;
}

export const TurfOwnerLayout: React.FC<TurfOwnerLayoutProps> = ({
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { successToast } = useToaster();
  const turfOwner = useSelector((state: RootState) => state.turfOwner.turfOwner);
  const { mutate: logoutReq } = useLogout(logoutTurfOwner); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/turfOwner/home';
  const navbarBgClass = isHomePage ? 'bg-transparent' : 'bg-black';
  
  const handleLogout = () => {
    logoutReq(undefined, {
      onSuccess: (data) => {
        dispatch(turfOwnerLogout());
        navigate('/');
        successToast(data.message);
      }
    });
  };

//   const customActions = [
//     {
//       id: 'analytics',
//       label: 'Analytics',
//       icon: <BarChart className="h-5 w-5" />,
//       onClick: () => navigate('/turfOwner/analytics')
//     },
//     {
//       id: 'customers',
//       label: 'Customers',
//       icon: <Users className="h-5 w-5" />,
//       onClick: () => navigate('/turfOwner/customers')
//     }
//   ];

  return (
    <div className="min-h-screen">
      <PrivateHeader
        user={turfOwner}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        backgroundClass={navbarBgClass}
        onLogout={handleLogout}
      />

      <Sidebar
        role="turfOwner"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        handleLogout={handleLogout}
        sidebarItems={sidebarItems}
      />

      <main className={sidebarOpen ? 'lg:ml-64' : ''}>
        <Outlet />
      </main>
    </div>
  );
};

export default TurfOwnerLayout;