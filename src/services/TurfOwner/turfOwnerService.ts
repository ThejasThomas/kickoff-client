import { turfOwnerAxiosInstance } from "@/api/turfOwner_axios";
import type { IAuthResponse, ITurfOwnerResponse, ITurfResponse } from "@/types/Response";
import type { Turf } from "@/types/Turf";

export const refreshTurfOwnerSession = async (): Promise<IAuthResponse> =>{
    const response = await turfOwnerAxiosInstance.get<IAuthResponse> (
        'turfowner/refresh-session'
    )
    return response.data;
}

export const addTurf =async (turfData:Partial<Turf>) : Promise <ITurfResponse> => {
    const response = await turfOwnerAxiosInstance.post<ITurfResponse> (
        'turfOwner/add-turf',
        turfData
    )
    return response.data
}
