import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import { TurfOwnerAuth } from "@/pages/turfOwner/TurfOwnerAuth";
import TurfOwnerHomePage from "@/pages/turfOwner/TurfOwnerHomePage";
import { protectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";

const TurfOwnerRoutes = () => {
  return (
    <Routes>
      <Route index element={<NoAuthRoute element={<TurfOwnerAuth />} />} />
      <Route
        path="/home"
        element={protectedRoute({
          element: <TurfOwnerHomePage />,
          allowedRoles: ["turfOwner"],
        })}
      />
      <Route
        path="/forgot-password"
        element={
          <NoAuthRoute
            element={
              <ForgotPassword role="turfOwner" signInPath="/turfOwner" />
            }
          />
        }
      ></Route>
      <Route
        path="/reset-password/:token"
        element={
          <NoAuthRoute
            element={<ResetPassword role="turfOwner" signInPath="/turfOwner" />}
          />
        }
      />
    </Routes>
  );
};

export default TurfOwnerRoutes;
