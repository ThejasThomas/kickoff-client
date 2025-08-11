import { TurfOwnerAuth } from "@/pages/turfOwner/TurfOwnerAuth"
import { NoAuthRoute } from "@/utils/protected/PublicRoute"
import { Route, Routes } from "react-router-dom"



const TurfOwnerRoutes=()=>{
    return(
        <Routes>

            <Route index element={<NoAuthRoute element={<TurfOwnerAuth/>}/>}/>
            {/* <Route
            path="/"
            element={
                allowedRoles={['turfOwner']}
                
            } */}

        </Routes>
    )
}

export default TurfOwnerRoutes;