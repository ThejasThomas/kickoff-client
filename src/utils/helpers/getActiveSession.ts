import type { RootState } from "@/store/store";
import { createSelector } from "@reduxjs/toolkit";

export const getActiveSession =createSelector(
    (state:RootState) => state.client.client,
    (state:RootState) => state.turfOwner.turfOwner,
    (state:RootState) =>state.admin.admin,
    (client,turfOwner,admin) => {
        if(client) return  {role:client.role,type:'client'}
        if(turfOwner) return  {role:turfOwner.role,type:'turfOwner'}
        if(admin) return {role:admin.role,type:'admin'}
        return null;
    }
)