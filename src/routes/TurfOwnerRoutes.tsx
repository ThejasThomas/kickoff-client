import ForgotPassword from "@/components/auth/ForgotPassword"
import ResetPassword from "@/components/auth/ResetPassword"
import { TurfOwnerAuth } from "@/pages/turfOwner/TurfOwnerAuth"
import { NoAuthRoute } from "@/utils/protected/PublicRoute"
import { Route, Routes } from "react-router-dom"



const TurfOwnerRoutes=()=>{
    return(
        <Routes>

            <Route index element={<NoAuthRoute element={<TurfOwnerAuth/>}/>}/>
            <Route
            path="/forgot-password"
            element={
                <NoAuthRoute
                element={<ForgotPassword role="turfOwner" signInPath="/turfOwner"/>}
                />
            }
              >

            </Route>
            <Route
        path="/reset-password/:token"
        element={
          <NoAuthRoute
            element={<ResetPassword role="turfOwner" signInPath="/turfOwner" />}
          />
        }
      />

        </Routes>
    )
}

export default TurfOwnerRoutes;