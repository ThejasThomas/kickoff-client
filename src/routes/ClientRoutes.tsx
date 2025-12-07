import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import { ClientLayout } from "@/components/layouts/ClientLayout";
import BookingViewDetailsPage from "@/pages/client/BookingsViewDetailPage";
import { ClientAuth } from "@/pages/client/ClientAuth";
import HomePage from "@/pages/client/ClientHomePage";
import AllTurfsPage from "@/pages/client/components/AllTurfsPage";
import TurfOverview from "@/pages/client/components/TurfOverview";
import TurfPaymentPage from "@/pages/client/components/TurfPaymentPage";
import CurrentBookingPage from "@/pages/client/CurrentBookingPage";
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";
import ClientPastBookingsPage from "@/pages/client/ClientPastBookingsPage";
import { ClientProfile } from "@/pages/client/components/ClientProfilePage";
import WalletPage from "@/pages/client/Wallet";
import HostGamePaymentPage from "@/pages/client/components/HostGamePaymentPage";
import HostedGamesPage from "@/pages/client/components/HostedGamesPage";
import JoinHostedGamePage from "@/pages/client/components/JoinHostedGamePage";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/paymentpage" element={<TurfPaymentPage />} />

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
        {/* <Route path="paymentpage" element={<TurfPaymentPage />} /> */}
        <Route path="allturfdisplay" element={<AllTurfsPage />} />
        <Route path="bookinghistory" element={<ClientPastBookingsPage />} />
        <Route path="upcomingbookings" element={<CurrentBookingPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="host-game-payment" element={<HostGamePaymentPage/>}/>
        <Route path="bookings/details" element={<BookingViewDetailsPage />} />
        <Route path="clientprofile" element={<ClientProfile />} />
        <Route path="hosted-games" element={<HostedGamesPage/>}/>
        <Route path="hosted-games/join-hosted-game/:id" element={<JoinHostedGamePage/>}/>
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
