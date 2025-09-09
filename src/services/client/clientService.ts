import { clientAxiosInstance } from "@/api/client_axios";
import type { IAuthResponse, ITurffResponse } from "@/types/Response";
import type { GetTurfsParams, IClient } from "@/types/User";
import axios from "axios";

export type IUpdateClientData = Pick<
  IClient,
  "fullName" | "email" | "phoneNumber" | "location"
>;

export const refreshClientSession = async (): Promise<IAuthResponse> => {
  const response = await axios.get<IAuthResponse>("/client/refresh-session");
  return response.data;
};
export const getTurfs = async (
  params: GetTurfsParams = {}
): Promise<ITurffResponse> => {
  try {
    const response = await clientAxiosInstance.get<ITurffResponse>(
      "/client/getturfs",
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
