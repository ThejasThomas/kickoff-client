import { turfOwnerAxiosInstance } from "@/api/turfOwner_axios";
import type { IAuthResponse, ITurfOwnerResponse, ITurfResponse } from "@/types/Response";
import type { ITurfBase } from "@/types/Turf";
import type { ITurfOwner } from "@/types/User";
// import type { ITurfOwner } from "@/types/User";

export const refreshTurfOwnerSession = async (): Promise<IAuthResponse> =>{
    const response = await turfOwnerAxiosInstance.get<IAuthResponse> (
        'turfowner/refresh-session'
    )
    return response.data;
}

export const getTurfOwnerProfile = async (): Promise<ITurfOwner> =>{
    const response = await turfOwnerAxiosInstance.get<ITurfOwner> (
        'turfOwner/profile'
    )
    return response.data;
}
export const addTurf =async (turfData:Partial<ITurfBase>) : Promise <ITurfResponse> => {
    const response = await turfOwnerAxiosInstance.post<ITurfResponse> (
        'turfOwner/add-turf',
        turfData
    )
    return response.data

}

export const updateTurfOwnerProfile = async (
  turfData: ITurfOwner
): Promise<ITurfOwnerResponse> => {
  const response = await turfOwnerAxiosInstance.put<ITurfOwnerResponse>(
    "turfOwner/update-profile",
    turfData
  )
  return response.data
}
