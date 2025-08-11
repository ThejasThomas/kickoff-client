// import { clientAxiosInstance } from "@/api/client_axios";
import type { IAuthResponse } from "@/types/Response";
import type { IClient } from "@/types/User";
import axios from "axios";

export type IUpdateClientData =Pick<
IClient,
'fullName' | 'email' |'phoneNumber' | 'location'
>;

export const refreshClientSession =async (): Promise<IAuthResponse> =>{
    const response =await axios.get<IAuthResponse>(
        '/client/refresh-session'
    );
    return response.data;
}
