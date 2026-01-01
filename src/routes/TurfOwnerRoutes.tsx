import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import NotFound from "@/components/common/NotFound";
import TurfOwnerLayout from "@/components/layouts/TurfOwnerLayout";
import WalletTransactionsPage from "@/components/turfOwner/WalletTransactionPage";
import AddSlotsPage from "@/pages/turfOwner/AddSlots";
import CancelRequestsPage from "@/pages/turfOwner/BookingsCancelrequests";
import MyTurfPage from "@/pages/turfOwner/MyTurfPage";
import OwnerEarnings from "@/pages/turfOwner/OwnerEarnings";
import RegisterTurfPage from "@/pages/turfOwner/RegisterTurfPage";
import GenerateSlotsPage from "@/pages/turfOwner/SlotBookingPage";
import { TurfOwnerAuth } from "@/pages/turfOwner/TurfOwnerAuth";
import ViewSlotsPage from "@/pages/turfOwner/ViewSlotsPage";
import OwnerWalletPage from "@/pages/turfOwner/WalletPage";
import AddOfflineBooking from "@/pages/turfOwner/components/Bookings/AddOfflineBooking";
import ApprovedTurfsPage from "@/pages/turfOwner/components/Bookings/Turfs.Page";
import BookingsPage from "@/pages/turfOwner/components/Bookings/UsersBookings";
import InvoiceOwnerBookingsPage from "@/pages/turfOwner/components/BookingsInvoice";
import OwnerInvoiceDownloadPage from "@/pages/turfOwner/components/DownloadOwnerInvoice";
import { EditTurfWrapper } from "@/pages/turfOwner/components/EditTurfWrapper";
import { OwnerProfile } from "@/pages/turfOwner/components/OwnerProfile";
import { RequestProfileUpdate } from "@/pages/turfOwner/components/RequestUpdatePage";
import { RetryUpdateTurfWrapper } from "@/pages/turfOwner/components/RetryUpdateTurfWrapper";
import SlotCancellationPage from "@/pages/turfOwner/components/SlotCancellationPage";
import TurfOwnerHomePage from "@/pages/turfOwner/components/TurfOwnerHomePage";
import TurfReApplyPage from "@/pages/turfOwner/components/TurfReapplyPage";
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";

const TurfOwnerRoutes = () => {
  return (
    <Routes>
      <Route index element={<NoAuthRoute element={<TurfOwnerAuth />} />} />
      <Route
        path="/request-updatedpage"
        element={
          <RequestProfileUpdate
            onSave={(data) => {
              console.log("profile saved", data);
            }}
          />
        }
      />
        <Route path="/retryedit-turf/:id" element={<RetryUpdateTurfWrapper />} />

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["turfOwner"]}
            element={<TurfOwnerLayout />}
          />
        }
      >
        <Route path="/home" element={<TurfOwnerHomePage />}></Route>
        <Route
          path="/profile"
          element={
            <OwnerProfile
              onSave={(data) => {
                console.log("profile saved", data);
              }}
            />
          }
        ></Route>
        <Route path="/add-turf" element={<RegisterTurfPage />}></Route>
        <Route path="/my-turf" element={<MyTurfPage />}></Route>
        <Route path="/add-slots" element={<AddSlotsPage/>}></Route>
        <Route path="/generate-slots/:id" element={<GenerateSlotsPage/>}></Route>
        <Route path="/edit-turf/:id" element={<EditTurfWrapper />} />
        <Route path="/view-slots/:id" element={<ViewSlotsPage/>} />
        <Route path="/re-apply-turf" element={<TurfReApplyPage/>}/>
        <Route path="/transactions" element={<WalletTransactionsPage/>}/>
        <Route path="/owner-invoice-download" element={<OwnerInvoiceDownloadPage/>}/>
        <Route path="/add-offline-booking/:turfId" element={<AddOfflineBooking/>}/>
        <Route path="/slot-cancellation" element={<SlotCancellationPage/>}/>
        <Route path="/invoice-owner-bookings" element={<InvoiceOwnerBookingsPage/>}/>
        <Route path="/owner-earnings" element={<OwnerEarnings/>}/>
        <Route path="/cancel-booking-requests" element={<CancelRequestsPage/>}/>
        <Route path="/wallet" element={<OwnerWalletPage/>}/>
        <Route path="/turfsbooking" element={<ApprovedTurfsPage/>} />
        <Route path="/bookings/:turfId" element={<BookingsPage/>} />
        
      </Route>

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
                      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default TurfOwnerRoutes;
