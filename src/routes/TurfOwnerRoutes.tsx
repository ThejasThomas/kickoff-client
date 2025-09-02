import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import TurfOwnerLayout from "@/components/layouts/TurfOwnerLayout";
import RegisterTurfPage from "@/pages/turfOwner/RegisterTurfPage";
import { TurfOwnerAuth } from "@/pages/turfOwner/TurfOwnerAuth";
import { OwnerProfile } from "@/pages/turfOwner/components/OwnerProfile";
import TurfOwnerHomePage from "@/pages/turfOwner/components/TurfOwnerHomePage";
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import {  Route, Routes } from "react-router-dom";

const TurfOwnerRoutes = () => {
  return (
    <Routes>
      <Route index element={<NoAuthRoute element={<TurfOwnerAuth />} />} />
      <Route  element={<ProtectedRoute allowedRoles={['turfOwner']} element={<TurfOwnerLayout/>}/>}>
        <Route path="/home" element={<TurfOwnerHomePage/>}></Route>
        <Route path="/profile" element={<OwnerProfile onSave={(data)=>{console.log('profile saved',data)}}/>}></Route>
        <Route path="/add-turf" element={<RegisterTurfPage/>}></Route>

      
      
      
      
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
    </Routes>
  );
};

export default TurfOwnerRoutes;
