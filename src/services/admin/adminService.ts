import { adminAxiosInstance } from "@/api/admin_axios";
import type { ApiResponse } from "@/types/api.type";
import type { IAxiosResponse } from "@/types/Response";
import type { GetAllUsersResponse, GetUsersParams, turfOwnerStatus, userStatus } from "@/types/User";
import { getErrorMessage } from "@/utils/errros/errorHandler";
import { ErrorIcon } from "react-hot-toast";

export const adminService = {
    getAllUSers:async<T =any>({
        role,
        page=1,
        limit=5,
        search='',
        status,
        excludeStatus
    }:GetUsersParams):Promise<GetAllUsersResponse<T>>=>{
        try {
            const response =await adminAxiosInstance.get<GetAllUsersResponse<T>>('/admin/users', {
                params:{
                    role,
                    page,
                    limit,
                    search,
                    status,
                    excludeStatus
                }
            })
            return response.data
        } catch(error) {
            return{
                success:false,
                message:getErrorMessage(error),
                users:[],
                totalPages:0,
                currentPage:0,



            }
        }
    },

    updateEntityStatus:async (
           entityType:"user" | "turfOwner",
           entityId:string,
           status:userStatus | turfOwnerStatus ,
           reason?: string,
           email?:string,
    ):Promise<IAxiosResponse> => {
        try {
            const response = await adminAxiosInstance.patch('/status',{
                entityType,
                entityId,
                status,
                reason,
                email
            })
            return response.data
        }catch(error) {
          console.error("Error updating user status:",error);
          return {
            success: false,
            message:getErrorMessage(error)
          }
          
        }
    }
}