import { refreshAdminSession } from "@/services/admin/adminService";
import type { IAdmin } from "@/types/User";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
    admin:IAdmin | null
}

const initialState:AdminState ={
    admin:null
}

export const refreshAdminSessionThunk =createAsyncThunk<
{user:IAdmin},
void,
{rejectValue: string}>('turfOwner/refreshSession',async(___reactRouterServerStorage___,{rejectWithValue})=> {
    try{
        const {user} =await refreshAdminSession()

        const mappedAdmin:IAdmin={
            userId:user.userId,
            fullName:(user as IAdmin).fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            status:user.status,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt
        }
        return {user:mappedAdmin}
    }catch(err){
        console.log(err)
        return rejectWithValue('Failed to refresh session')
    }
})
const adminSlice =createSlice({
    name:'admin',
    initialState,
    reducers: {
        adminLogin:(state,action:PayloadAction<IAdmin>) => {
            state.admin=action.payload
        },
        adminLogout:(state)=>{
            state.admin =null;
        }
        
    },
    extraReducers:(builder) => {
        builder
        .addCase(refreshAdminSessionThunk.fulfilled,(state,action) =>{
            state.admin=action.payload.user;
        })
        .addCase(refreshAdminSessionThunk.rejected,(_,action) =>{
            console.error(action.payload || 'session refresh failed');
            
        })
    }
})

export const { adminLogin, adminLogout } = adminSlice.actions;

export default adminSlice.reducer;
