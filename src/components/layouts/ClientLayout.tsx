import { useToaster } from "@/hooks/ui/useToaster"
import { useAppDispatch, type RootState } from "@/store/store"
import { useState } from "react"
import { useSelector } from "react-redux"
import { data, useLocation, useNavigate } from "react-router-dom"
import { PrivateHeader } from "../mainComponents/PrivateHeader"
import { clientLogout } from "@/store/slices/client_slice"
import { Sidebar } from "../mainComponents/Sidebar"

export const ClientLayout =()=>{
    const [isSideBarVisible,setIsSideBarVisible]=useState(false)
    // const {successToast,errorToast} =useToaster();
    const dispatch=useAppDispatch()
    const navigate=useNavigate();
    const location =useLocation();

    const user =useSelector((state:RootState)=>state.client.client)
    // const {mutate:logoutReq} =useLogout(logoutClient);
    //   const { mutate: logoutReq } = useLogout(logoutClient);


    // const handleLogout =()=>{
    //     logoutReq(undefined, {
    //         onSuccess:(data) => {
    //             dispatch(clientLogout());
    //             navigate('/')
    //             successToast(data.message)
    //         }
    //     })
    // }

    return(
        <div>
            {/* <PrivateHeader 
            className="z-4"
            user={user}
            // onLogout={handleLogout}
            // onSidebarToggle={setIsSideBarVisible(!isSideBarVisible)}
            /> */}

            <Sidebar
            role='client'
            isVisible={isSideBarVisible}
            onClose={()=> setIsSideBarVisible(false)}
            />
            
        </div>
    )
    
}