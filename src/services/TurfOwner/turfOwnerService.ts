import { axiosInstance } from "@/api/private_axios";
import { OWNER_ROUTE } from "@/constants/owner_route";
import type { IAuthResponse, ITurfOwnerResponse, ITurfResponse } from "@/types/Response";
import type { ITurfBase } from "@/types/Turf";
import type { ITurfOwner, turfOwnerStatus } from "@/types/User";

export const refreshTurfOwnerSession = async (): Promise<IAuthResponse> =>{
    const response = await axiosInstance.get<IAuthResponse> (
        OWNER_ROUTE.REFRESH_SESSION
    )
    return response.data;
}

export const getTurfOwnerProfile = async (): Promise<ITurfOwner> =>{
    const response = await axiosInstance.get<ITurfOwner> (
        OWNER_ROUTE.PROFILE
    )
    return response.data;
}
export const addTurf =async (turfData:Partial<ITurfBase>) : Promise <ITurfResponse> => {
    const response = await axiosInstance.post<ITurfResponse> (
        OWNER_ROUTE.ADD_TURF,
        turfData
    )
    return response.data

}

export const updateTurfOwnerProfile = async (
  turfData: ITurfOwner
): Promise<ITurfOwnerResponse> => {
  const response = await axiosInstance.put<ITurfOwnerResponse>(
    OWNER_ROUTE.UPDATE_PROFILE,
    turfData
  )
  return response.data
}

export const retryAdminApproval = async (userId:string):Promise<{status:turfOwnerStatus}>=>{
  const response = await axiosInstance.post<{status:turfOwnerStatus}>(
    OWNER_ROUTE.RETRY_APPROVAL,
    {userId}
  )
  return response.data
}
