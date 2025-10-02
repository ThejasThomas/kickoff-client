// import { adminAxiosInstance } from "@/api/admin_axios";
import { axiosInstance } from "@/api/private_axios";
import { ADMIN_ROUTES } from "@/constants/admin_route";
import type { IAuthResponse, IAxiosResponse } from "@/types/Response";
import type {
  GetAllTurfsResponse,
  GetAllUsersResponse,
  GetTurfsParams,
  GetUsersParams,
  turfOwnerStatus,
  userStatus,
} from "@/types/User";
import { getErrorMessage } from "@/utils/errros/errorHandler";

export const refreshAdminSession = async (): Promise<IAuthResponse> => {
  const response = await axiosInstance.get<IAuthResponse>(
    ADMIN_ROUTES.REFRESH_SESSION
  );
  return response.data;
};

export const adminService = {
  getAllUSers: async <T = any>({
    role,
    page = 1,
    limit = 5,
    search = "",
    status,
    excludeStatus,
  }: GetUsersParams): Promise<GetAllUsersResponse> => {
    try {
      const response = await axiosInstance.get<GetAllUsersResponse>(
        ADMIN_ROUTES.USERS,
        {
          params: {
            role,
            page,
            limit,
            search,
            status,
            excludeStatus,
          },
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
        users: [],
        totalPages: 0,
        currentPage: 0,
      };
    }
  },

  getAllTurfs: async ({
    page = 1,
    limit = 5,
    search = "",
    status,
    excludeStatus,
  }: GetTurfsParams): Promise<GetAllTurfsResponse> => {
    try {
      const response = await axiosInstance.get<GetAllTurfsResponse>(
        ADMIN_ROUTES.TURFS,
        {
          params: {
            page,
            limit,
            search,
            status,
            excludeStatus,
          },
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
        turfs: [],
        totalPages: 0,
        currentPage: 0,
      };
    }
  },

  updateEntityStatus: async (
    entityType: "client" | "turfOwner" | "turf",
    entityId: string,
    status: userStatus | turfOwnerStatus,
    reason?: string,
    ownerId?: string,

    email?: string
  ): Promise<IAxiosResponse> => {
    try {
      const response = await axiosInstance.patch(ADMIN_ROUTES.STATUS, {
        entityType,
        entityId,
        status,
        reason,
        ownerId,
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },
};
