import { ClientLayout } from "@/components/layouts/ClientLayout"
import { ClientAuth } from "@/pages/client/ClientAuth"
import { NoAuthRoute } from "@/utils/protected/PublicRoute"
import { Route, Routes } from "react-router-dom"

const ClientRoutes =() =>{
    return(
        <Routes>
            <Route index element={<NoAuthRoute element={<ClientAuth/>}/>}/>
            <Route
            path="/"
            
                element={<ClientLayout/>
                    
                }>
            </Route>
            
        </Routes>
    )

}
export default ClientRoutes;