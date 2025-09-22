import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import { ClientLayout } from "@/components/layouts/ClientLayout";
import { ClientAuth } from "@/pages/client/ClientAuth";
import HomePage from "@/pages/client/ClientHomePage";
import AllTurfsPage from "@/pages/client/components/AllTurfsPage";
import TurfOverview from "@/pages/client/components/TurfOverview";
import TurfPaymentPage from "@/pages/client/components/TurfPaymentPage";
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route index element={<NoAuthRoute element={<ClientAuth />} />} />
      <Route
        path="/"
        element={
          <ProtectedRoute
            allowedRoles={["client"]}
            element={<ClientLayout />}
          />
        }
      >
        <Route
          path="home"
          element={
            <HomePage
              onTurfSelect={(id) => console.log("Selected turf:", id)}
            />
          }
        />{" "}
        <Route path="turfoverview/:id" element={<TurfOverview />} />
        <Route path="paymentpage" element={<TurfPaymentPage />} />
        <Route path="allturfdisplay" element={<AllTurfsPage/>}/>
      </Route>

      <Route
        path="/forgot-password"
        element={
          <NoAuthRoute
            element={<ForgotPassword role="client" signInPath="/" />}
          />
        }
      ></Route>

      <Route
        path="/reset-password/:token"
        element={
          <NoAuthRoute
            element={<ResetPassword role="client" signInPath="/" />}
          />
        }
      ></Route>
    </Routes>
  );
};
export default ClientRoutes;
