import { turfOwnerAxiosInstance } from "@/api/turfOwner_axios";
import type { IAuthResponse } from "@/types/Response";

export const refreshTurfOwnerSession = async (): Promise<IAuthResponse> =>{
    const response = await turfOwnerAxiosInstance.get<IAuthResponse> (
        'turfOwner/refresh-session'
    )
    return response.data;
}
