import { axiosInstance } from "@/api/private_axios";
import { OWNER_ROUTE } from "@/constants/owner_route";
import type {  GetMyTurfsParams, IAuthResponse, IGenerateSlotsResponse, ITurffResponse, ITurfOwnerResponse, ITurfResponse } from "@/types/Response";
import type { GenerateSlotsData } from "@/types/Slots";
import type { ITurf, ITurfBase, NewTurf } from "@/types/Turf";
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

export const getTurfById = async (id: string): Promise<ITurf> => {
  console.log('iddddddd',id)
  const response = await axiosInstance.get<{success: boolean;turf:ITurf}>(
    `${OWNER_ROUTE.GETURFBYID}/${id}`
  )
  return response.data.turf;
}
export const updateTurf = async(id: string, data: Partial<NewTurf &{isRetryUpdata?:boolean;retryToken?:string}>): Promise<ITurf> => {
  console.log('heyyy broooooooo',id)
  const response = await axiosInstance.put<ITurf>(
    `${OWNER_ROUTE.UPDATE_TURF}/${id}`,
    data
  );
  return response.data;
};
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

export const requestupdateProfile = async (
  turfData: ITurfOwner
): Promise<ITurfOwnerResponse> => {
  const response = await axiosInstance.put<ITurfOwnerResponse>(
    OWNER_ROUTE.REQUESTUPDATEPROFILE,
    turfData
  )
  return response.data
}

export const getMyTurfs = async (
  params?: GetMyTurfsParams
): Promise<ITurffResponse> => {
  const response = await axiosInstance.get<ITurffResponse>(
    OWNER_ROUTE.GET_MY_TURF,
    { params } 
  );
  return response.data
}

export const generateSlots =async (data:GenerateSlotsData):Promise<IGenerateSlotsResponse> =>{
  const response =await axiosInstance.post<IGenerateSlotsResponse>(OWNER_ROUTE.GENERATESLOTS,data)
  return response.data
}

export const retryAdminApproval = async (userId:string):Promise<{status:turfOwnerStatus}>=>{
  const response = await axiosInstance.post<{status:turfOwnerStatus}>(
    OWNER_ROUTE.RETRY_APPROVAL,
    {userId}
  )
  return response.data
}