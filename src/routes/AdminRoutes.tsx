import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import { AdminAuth } from "@/pages/admin/AdminAuth";
import AdminLayout from "@/pages/admin/AdminLayout";
import OwnerManagement from "@/pages/admin/sub-pages/OwnerManagement";
import VendorVerification from "@/pages/admin/sub-pages/OwnerVerification";
import UserManagement from "@/pages/admin/sub-pages/UsersManagement";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<NoAuthRoute element={<AdminAuth />} />} />
      <Route
        path="/forgot-password"
        element={
          <NoAuthRoute
            element={<ForgotPassword role="admin" signInPath="/admin" />}
          />
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <NoAuthRoute
            element={<ResetPassword role="admin" signInPath="/admin" />}
          />
        }
      />
      <Route path="/owner-verification"element={<AdminLayout><VendorVerification /></AdminLayout>}/>
      <Route path="/owner-management" element={<AdminLayout><OwnerManagement/></AdminLayout>}/>
      <Route path="/users-management" element={<AdminLayout><UserManagement/></AdminLayout>}/>

      
    </Routes>
  );
};

export default AdminRoutes;
