
import { Sidebar } from "../mainComponents/Sidebar"

import { useToaster } from "@/hooks/ui/useToaster"
import { useAppDispatch, type RootState } from "@/store/store"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { PrivateHeader } from "../mainComponents/PrivateHeader"
import { clientLogout, refreshClientSessionThunk } from "@/store/slices/client_slice"
import { logoutClient } from "@/services/auth/authService"
import { useLogout } from "@/hooks/auth/useLogout"
import { Footer } from "../mainComponents/Footer"

export const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { successToast } = useToaster()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const user = useSelector((state: RootState) => state.client.client)
  const { mutate: logoutReq } = useLogout(logoutClient)

  const isHomePage = location.pathname === "/client/home"
  const navbarBgClass = isHomePage ? "bg-transparent" : "bg-black"

  const handleLogout = () => {
    logoutReq(undefined, {
      onSuccess: (data) => {
        dispatch(clientLogout())
        navigate("/")
        successToast(data.message)
      },
    })
  }

  useEffect(() => {
    const handleFocus = () => {
      dispatch(refreshClientSessionThunk())
    }
    window.addEventListener("focus", handleFocus)
    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PrivateHeader
        user={user}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        backgroundClass={navbarBgClass}
        onLogout={handleLogout}
      />

      <Sidebar role="client" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} handleLogout={handleLogout} />

      <main className="w-full">
        <Outlet context={user} />
      </main>

            <Footer role="client" />

      
    </div>
  )
}

export default ClientLayout
