import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import NotFound from "@/components/common/NotFound";
import AdminLayout from "@/components/layouts/AdminLayout";
import { AdminAuth } from "@/pages/admin/AdminAuth";
import AdminDashboard from "@/pages/admin/sub-pages/AdminDashboard";
import AdminTurfsForReview from "@/pages/admin/sub-pages/AdminTurfsForReview";
import AdminWalletPage from "@/pages/admin/sub-pages/AdminWallet";
import AdminInvoiceDownloadPage from "@/pages/admin/sub-pages/InvoiceDownloadPage";
import OwnerManagement from "@/pages/admin/sub-pages/OwnerManagement";
import VendorVerification from "@/pages/admin/sub-pages/OwnerVerification";
import AdminOwnerWalletTransactions from "@/pages/admin/sub-pages/TransactionDetailsPAge";
import TransactionViewDetails from "@/pages/admin/sub-pages/TrasactionDetails";
import TurfsManagement from "@/pages/admin/sub-pages/TurfsManagement";
import AdminTurfReviews from "@/pages/admin/sub-pages/TurfsReviewManagement";
import TurfVerification from "@/pages/admin/sub-pages/TurfsVerification";
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
      <Route
        path="/dashboard"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route
        path="/owner-verification"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <VendorVerification />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route
        path="/owner-management"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <OwnerManagement />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route
        path="/users-management"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route
        path="/turfs-verification"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <TurfVerification />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route
        path="/review-management/:turfId"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <AdminTurfReviews />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route
        path="/turfs-for-review"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <AdminTurfsForReview />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route
        path="/wallet"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <AdminWalletPage />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route
        path="/transactions"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <AdminOwnerWalletTransactions />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route
        path="/invoice-download"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <AdminInvoiceDownloadPage />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route
        path="/transaction-view-detail/:transactionId"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <TransactionViewDetails />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />

      <Route
        path="/turfs-management"
        element={ProtectedRoute({
          element: (
            <AdminLayout>
              <TurfsManagement />
            </AdminLayout>
          ),
          allowedRoles: ["admin"],
        })}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
