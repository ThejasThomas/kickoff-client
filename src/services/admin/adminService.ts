// import { adminAxiosInstance } from "@/api/admin_axios";
import { axiosInstance } from "@/api/private_axios";
import { ADMIN_ROUTES } from "@/constants/admin_route";
import type { AdminWallet } from "@/types/admin_wallet_type";
import type { AdminDashboardEntity, RevenuePeriod } from "@/types/adminDashboard_type";
import type { AdminWalletTransactionResponse, IAuthResponse, IAxiosResponse } from "@/types/Response";
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

 getTurfsReviewAdmin:async (
  turfId:string,
  page =1,
  limit=10
 )=>{
  const response =await axiosInstance.get(
    `${ADMIN_ROUTES.GET_TURFS_REVIEWS}/${turfId}`,
    {
      params:{page,limit}
    }
  )
  return response.data;
 },
 deleteReviewAdmin:async(
  reviewId:string
 )=>{
  const response =await axiosInstance.delete(`${ADMIN_ROUTES.DELETE_REVIEWS}/${reviewId}`)

  return response.data
 },

 getAdminWallet:async():Promise<{success:boolean;wallet:AdminWallet}>=>{
  try{
    const response = await axiosInstance.get(
      `${ADMIN_ROUTES.ADMIN_WALLET}`
    )
    return response.data;
  }catch(error){
    return{
      success:true,
      wallet:{balance:0}
    }
  }
 },

 getAdminwalletTransactions:async(
  page=1,
  limit=10
 ):Promise<AdminWalletTransactionResponse>=>{
  try{
    const response=await axiosInstance.get<AdminWalletTransactionResponse>(
      ADMIN_ROUTES.ADMIN_WALLET_TRANSACTIONS,
      {
        params:{page,limit}
      }
    )
    return response.data
  }catch{
    return{
      success: false,
        transactions: [],
        total: 0,
        page: 1,
        totalPages: 1,
    }
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
  getDashboard:async(
    period:RevenuePeriod
  ):Promise<{success:boolean;data:AdminDashboardEntity}>=>{
    const response = await axiosInstance.get(
      ADMIN_ROUTES.GET_DASHBOARD,
      {
        params:{period},
      }
    )
    return response.data;
  }

};
