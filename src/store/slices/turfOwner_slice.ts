import type { ITurfOwner } from "@/types/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TurfOwnerState {
    turfOwner:ITurfOwner |null;
}

const initialState:TurfOwnerState = {
    turfOwner:null,
}


const turfOwnerSlice =createSlice({
    name:'turfOwner',
    initialState,
    reducers:{
        turfOwnerLogin:(state,action: PayloadAction<ITurfOwner>) =>{
            state.turfOwner =action.payload;
        },
        
    },

})

export const {turfOwnerLogin} =turfOwnerSlice.actions;