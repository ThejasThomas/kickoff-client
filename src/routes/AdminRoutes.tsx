import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import AdminLayout from "@/components/layouts/AdminLayout";
import { AdminAuth } from "@/pages/admin/AdminAuth";
import AdminDashboard from "@/pages/admin/sub-pages/AdminDashboard";
import OwnerManagement from "@/pages/admin/sub-pages/OwnerManagement";
import VendorVerification from "@/pages/admin/sub-pages/OwnerVerification";
import UserManagement from "@/pages/admin/sub-pages/UsersManagement";
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
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
        <Route path="/dashboard" element={ProtectedRoute({element: <AdminLayout><AdminDashboard/></AdminLayout>,allowedRoles: ["admin"]})}/>
      <Route path="/owner-verification" element={ProtectedRoute({element: <AdminLayout><VendorVerification /></AdminLayout>,allowedRoles: ["admin"]})}/>
      <Route path="/owner-management" element={ProtectedRoute({ element: <AdminLayout><OwnerManagement/></AdminLayout>,allowedRoles:["admin"]})}/>
      <Route path="/users-management" element={ ProtectedRoute({element:<AdminLayout><UserManagement/></AdminLayout>,allowedRoles:["admin"]})}/>

      
    </Routes>
  );
};

export default AdminRoutes;
