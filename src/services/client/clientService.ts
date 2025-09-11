import { axiosInstance } from "@/api/private_axios";
import { CLIENT_ROUTE } from "@/constants/client_route";
import type { IAuthResponse, ITurffResponse } from "@/types/Response";
import type { GetTurfsParams, IClient } from "@/types/User";

export type IUpdateClientData = Pick<
  IClient,
  "fullName" | "email" | "phoneNumber" | "location"
>;

export const refreshClientSession = async (): Promise<IAuthResponse> => {
  const response = await axiosInstance.get<IAuthResponse>(CLIENT_ROUTE.REFRESH_SESSION);
  return response.data;
};
export const getTurfs = async (
  params: GetTurfsParams = {}
): Promise<ITurffResponse> => {
  try {
    const response = await axiosInstance.get<ITurffResponse>(
      CLIENT_ROUTE.GET_TURF,
      {
        params: {
          params: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
          status: params.status || "",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getTurfs:", error);
    throw error;
  }
};
