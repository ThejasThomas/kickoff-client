import { adminAxiosInstance } from "@/api/admin_axios";
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
  const response = await adminAxiosInstance.get<IAuthResponse>(
    "/admin/refresh-session"
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
  }: GetUsersParams): Promise<GetAllUsersResponse<T>> => {
    try {
      const response = await adminAxiosInstance.get<GetAllUsersResponse<T>>(
        "/admin/users",
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
      const response = await adminAxiosInstance.get<GetAllTurfsResponse>(
        "/admin/turfs",
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
    entityType: "client" | "turfOwner"|"turf",
    entityId: string,
    status: userStatus | turfOwnerStatus,
    reason?: string,
    email?: string
  ): Promise<IAxiosResponse> => {
    try {
      const response = await adminAxiosInstance.patch("/admin/status", {
        entityType,
        entityId,
        status,
        reason,
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
