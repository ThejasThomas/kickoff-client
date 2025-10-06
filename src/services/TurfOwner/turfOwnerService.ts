import { axiosInstance } from "@/api/private_axios";
import { OWNER_ROUTE } from "@/constants/owner_route";
import type {
  GetMyTurfsParams,
  IAuthResponse,
  IBookResponse,
  IGenerateRulesResponse,
  IGenerateSlotsResponse,
  ITurffResponse,
  ITurfOwnerDetailsResponse,
  ITurfResponse,
} from "@/types/Response";
import type { IRules } from "@/types/rules_type";
import type { GenerateSlotsData } from "@/types/Slots";
import type { ITurf, ITurfBase, NewTurf } from "@/types/Turf";
import type {
  IClient,
  ITurfOwner,
  ITurfOwnerDetails,
  turfOwnerStatus,
} from "@/types/User";

export const refreshTurfOwnerSession = async (): Promise<IAuthResponse> => {
  const response = await axiosInstance.get<IAuthResponse>(
    OWNER_ROUTE.REFRESH_SESSION
  );
  return response.data;
};

export const getTurfOwnerProfile = async (): Promise<ITurfOwner> => {
  const response = await axiosInstance.get<ITurfOwner>(OWNER_ROUTE.PROFILE);
  return response.data;
};

export const getTurfById = async (id: string): Promise<ITurf> => {
  console.log("iddddddd", id);
  const response = await axiosInstance.get<{ success: boolean; turf: ITurf }>(
    `${OWNER_ROUTE.GETURFBYID}/${id}`
  );
  return response.data.turf;
};

export const updateTurf = async (
  id: string,
  data: Partial<NewTurf & { isRetryUpdata?: boolean; retryToken?: string }>
): Promise<ITurf> => {
  console.log("heyyy broooooooo", id);
  const response = await axiosInstance.put<ITurf>(
    `${OWNER_ROUTE.UPDATE_TURF}/${id}`,
    data
  );
  return response.data;
};
export const addTurf = async (
  turfData: Partial<ITurfBase>
): Promise<ITurfResponse> => {
  console.log("turffff", turfData);
  const response = await axiosInstance.post<ITurfResponse>(
    OWNER_ROUTE.ADD_TURF,
    turfData
  );
  return response.data;
};

export const updateTurfOwnerProfile = async (
  turfData: ITurfOwnerDetails
): Promise<ITurfOwnerDetailsResponse> => {
  const response = await axiosInstance.put<ITurfOwnerDetailsResponse>(
    OWNER_ROUTE.UPDATE_PROFILE,
    turfData
  );
  return response.data;
};

export const addRulesforSlot = async (
  rules: IRules
): Promise<IGenerateRulesResponse> => {
  const response = await axiosInstance.post<IGenerateRulesResponse>(
    OWNER_ROUTE.ADD_RULES,
    rules
  );
  return response.data;
};

export const getRules = async (
  turfId: string
): Promise<IGenerateRulesResponse> => {
  const response = await axiosInstance.get<IGenerateRulesResponse>(
    `${OWNER_ROUTE.GET_RULES}/${turfId}`
  );
  return response.data;
};
export const requestupdateProfile = async (
  turfData: ITurfOwnerDetails
): Promise<ITurfOwnerDetailsResponse> => {
  const response = await axiosInstance.put<ITurfOwnerDetailsResponse>(
    OWNER_ROUTE.REQUESTUPDATEPROFILE,
    turfData
  );
  return response.data;
};

export const getMyTurfs = async (
  params?: GetMyTurfsParams
): Promise<ITurffResponse> => {
  const response = await axiosInstance.get<ITurffResponse>(
    OWNER_ROUTE.GET_MY_TURF,
    { params }
  );
  return response.data;
};

export const generateSlots = async (
  data: GenerateSlotsData
): Promise<IGenerateSlotsResponse> => {
  const response = await axiosInstance.post<IGenerateSlotsResponse>(
    OWNER_ROUTE.GENERATESLOTS,
    data
  );
  return response.data;
};
export const getbookedUsersDetails = async (
  userId: string
): Promise<IClient> => {
  const response = await axiosInstance.get<IClient>(
    `${OWNER_ROUTE.GET_BOOKED_USER_DETAILS}/${userId}`
  );
  return response.data;
};

export const getusersBookings = async ({
  turfId,
  date,
}: {
  turfId: string;
  date: string;
}): Promise<IBookResponse> => {
  const response = await axiosInstance.get<IBookResponse>(
    OWNER_ROUTE.GET_ALL_BOOKINGS,
    {
      params: {
        turfId,
        date,
      },
    }
  );
  return response.data;
};

export const retryAdminApproval = async (
  userId: string
): Promise<{ status: turfOwnerStatus }> => {
  const response = await axiosInstance.post<{ status: turfOwnerStatus }>(
    OWNER_ROUTE.RETRY_APPROVAL,
    { userId }
  );
  return response.data;
};
