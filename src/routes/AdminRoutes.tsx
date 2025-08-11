import { AdminAuth } from "@/pages/admin/AdminAuth"
import { NoAuthRoute } from "@/utils/protected/PublicRoute"
import { Route, Routes } from "react-router-dom"

const AdminRoutes =()=>{
    return(
        <Routes>
            <Route index element={<NoAuthRoute element={<AdminAuth/>}/>} />
        </Routes>
    )
}

export default AdminRoutes;