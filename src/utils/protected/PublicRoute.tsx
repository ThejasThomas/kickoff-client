import type { RootState } from "@/store/store";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface NoAuthRouteProps {
    element:JSX.Element;
}

const getAciveSession =(state:RootState) => {
    if(state.client.client)
        return {role:state.client.client.role,type:'client'}
    if(state.turfOwner.turfOwner)
        return {role:state.turfOwner.turfOwner.role,type:'turfOwner'}
    if(state.admin.admin)
        return {role:state.admin.admin.role,type:'admin'}
}

export const NoAuthRoute =({element}:NoAuthRouteProps)=>{
    const session =useSelector((state:RootState)=>getAciveSession(state))

    if(session) {
        const roleRedirects:Record<string, string>={
            client:'/home',
            turfOwner:'/turfOwner/owner-earnings',
            admin:'/admin/dashboard'
        }
        return <Navigate to={roleRedirects[session.type]||'unauthorized'}/>
    }
    return element;
}