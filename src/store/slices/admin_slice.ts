import type { IAdmin } from "@/types/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
    admin:IAdmin | null
}

const initialState:AdminState ={
    admin:null
}

const adminSlice =createSlice({
    name:'admin',
    initialState,
    reducers: {
        adminLogin:(state,action:PayloadAction<IAdmin>) => {
            state.admin=action.payload
        }
        
    }
})

export const {adminLogin} =adminSlice.actions;