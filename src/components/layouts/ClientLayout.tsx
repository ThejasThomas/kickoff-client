import { useToaster } from "@/hooks/ui/useToaster";
import { useAppDispatch, type RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { PrivateHeader } from "../mainComponents/PrivateHeader";
import { clientLogout, refreshClientSessionThunk } from "@/store/slices/client_slice";
import { Sidebar } from "../mainComponents/Sidebar";
import { logoutClient } from "@/services/auth/authService";
import { useLogout } from "@/hooks/auth/useLogout";
import { MessageSquare, Calendar } from "lucide-react";

export const ClientLayout = () => {
  const [isSideBarVisible, setIsSideBarVisible] = useState(false);
  const { successToast } = useToaster();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.client.client);
  const { mutate: logoutReq } = useLogout(logoutClient);

  const handleLogout = () => {
    logoutReq(undefined, {
      onSuccess: (data) => {
        dispatch(clientLogout());
        navigate('/');
        successToast(data.message);
      }
    });
  };

  // Custom actions for client header
//   const customActions = [
//     // {
//     //   id: 'messages',
//     //   label: 'Messages',
//     //   icon: <MessageSquare className="h-5 w-5" />,
//     //   onClick: () => navigate('/client/messages')
//     // },
//     // {
//     //   id: 'bookings',
//     //   label: 'My Bookings',
//     //   icon: <Calendar className="h-5 w-5" />,
//     //   onClick: () => navigate('/client/bookings')
//     // }
//   ];

  useEffect(() => {
    const handleFocus = () => {
      dispatch(refreshClientSessionThunk());
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch]);

  return (
    <div>
      <PrivateHeader
        className="z-40"
        user={user}
        onLogout={handleLogout}
        onSidebarToggle={() => setIsSideBarVisible(!isSideBarVisible)}
        // customActions={customActions}
      />

      <Sidebar
        role='client'
        isVisible={isSideBarVisible}
        onClose={() => setIsSideBarVisible(false)}
        handleLogout={handleLogout}
      />

      <Outlet context={user} />
    </div>
  );
};