import { axiosInstance } from "@/api/private_axios";
import { CLIENT_ROUTE } from "@/constants/client_route";
import type { IAddRatingPayload, IAddReviewPayload } from "@/types/addReview_type";
import type { IBookings } from "@/types/Booking_type";
import type { ChatPageData } from "@/types/chat_pageData";
import {
  type GetUpcomingBookings,
  type IAddMoneyResponse,
  type IAddRatingResponse,
  type IAddReviewResponse,
  type IAuthResponse,
  type IBookResponse,
  type ICreateHostedGameResponse,
  type IHostedGameListResponse,
  type ITurffResponse,
  type ITurfRatingResponse,
  type ITurfReviewResponse,
  type IWalletBalanceResponse,
  type IWalletHistoryResponse,
  type SlotResponse,
} from "@/types/Response";
import type { ISlot } from "@/types/Slot";
import type { ITurf } from "@/types/Turf";
import type { ITurfReview } from "@/types/turfReview_type";
import type { GetTurfsParams, IClient, IUpdateClient } from "@/types/User";

export type IUpdateClientData = Pick<
  IClient,
  "fullName" | "email" | "phoneNumber" | "location"
>;

export const refreshClientSession = async (): Promise<IAuthResponse> => {
  const response = await axiosInstance.get<IAuthResponse>(
    CLIENT_ROUTE.REFRESH_SESSION
  );
  return response.data;
};
export const getTurfById = async (id: string): Promise<ITurf> => {
  console.log("iddddddd", id);
  const response = await axiosInstance.get<{ success: boolean; turf: ITurf }>(
    `${CLIENT_ROUTE.GETURFBYID}/${id}`
  );
  return response.data.turf;
};
export const holdSlot =async(data:{
  turfId:string,
  date:string,
  startTime:string,
  endTime:string
})=>{
  const response=await axiosInstance.post(
    CLIENT_ROUTE.HOLD_SLOT,
    data
  )
  return response.data;
}
export const releaseSlot =async (data:{
  turfId:string;
  date:string;
  startTime:string;
  endTime:string
})=>{
  const response =await axiosInstance.post(
    CLIENT_ROUTE.RELEASE_SLOT,
    data
  );
  return response.data;
}

export const getClientProfile = async (): Promise<IClient> => {
  console.log("GETPROFILE route:", CLIENT_ROUTE.GETPROFILE);

  const response = await axiosInstance.get<IClient>(CLIENT_ROUTE.GETPROFILE);

  return response.data;
};


export const updateClientProfile = async (
  clientData: IUpdateClient
): Promise<void> => {
  console.log("reach api");
  const response = await axiosInstance.patch(
    CLIENT_ROUTE.UPDATE_USER_DETAILS,
    clientData
  );
  return response.data;
};

export const getSlots = async (
  turfId: string,
  date: string
): Promise<ISlot[]> => {
  const response = await axiosInstance.get<SlotResponse>(
    `${CLIENT_ROUTE.GETSLOTS}/${turfId}?date=${date}`
  );
  return response.data.slots;
};
export const bookSlots = async (
  bookData: Partial<IBookings>
): Promise<IBookResponse> => {
  console.log("bookiokkkktheee sloottt", bookData);
  const response = await axiosInstance.post<IBookResponse>(
    CLIENT_ROUTE.BOOKSLOT,
    bookData
  );
  return response.data;
};

export const getupcomingBookings = async (
  params: GetUpcomingBookings = {}
): Promise<IBookResponse> => {
  const response = await axiosInstance.get<IBookResponse>(
    CLIENT_ROUTE.GET_UPCOMING_BOOKINGS,
    {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || "",
      },
    }
  );
  return response.data;
};

export const getBookingDetails = async (
  turfId: string
): Promise<ITurffResponse> => {
  const response = await axiosInstance.get<ITurffResponse>(
    `${CLIENT_ROUTE.GETBOOKINGSTURF}?turfId=${turfId}`
  );
  return response.data;
};
export const getpastbookings = async (page=1,limit=3): Promise<IBookResponse> => {
  const response = await axiosInstance.get<IBookResponse>(
    `${CLIENT_ROUTE.GET_PAST_BOOKINGS}?page=${page}&limit=${limit}`
  );
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
          page: params.page || 1,
          limit: params.limit || 5,
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

export const addMoney = async (
  amount: number,
  reason: string
): Promise<IAddMoneyResponse> => {
  const response = await axiosInstance.post<IAddMoneyResponse>(
    CLIENT_ROUTE.ADDMONEY,
    {
      amount,
      reason,
    }
  );
  return response.data;
};
export const getWalletBalance = async () => {
  const response = await axiosInstance.get<IWalletBalanceResponse>(
    CLIENT_ROUTE.GET_WALLET_BALANCE
  );
  return response.data;
};
export const getTransactionHistory = async (page = 1, limit = 2) => {
  const response = await axiosInstance.get<IWalletHistoryResponse>(
    CLIENT_ROUTE.GET_TRANSACTION_HISTORY,
    {
      params: { page, limit },
    }
  );
  return response.data;
};
export const requestCancelBooking = async (
  bookingId: string,
  reason: string
) => {
  const response = await axiosInstance.post(
    `${CLIENT_ROUTE.CANCEL_BOOKING_REQUEST}/${bookingId}`,
    { reason }
  );
  return response.data;
};

export const hostGame = async (data: {
  turfId: string;
  courtType: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  pricePerPlayer: number;
}): Promise<ICreateHostedGameResponse> => {
  const response = await axiosInstance.post<ICreateHostedGameResponse>(
    CLIENT_ROUTE.HOST_GAME,
    data
  );
  return response.data;
};
export const getUpcomingHostedGamesByUser =async ({
  page,
  limit,
  search
}:{
  page:number;
  limit:number;
  search:string;
})=>{
  const response =await axiosInstance.get(
    CLIENT_ROUTE.GETUPCOMIG_HOSTED_GAME_BY_USER,
    {params:{page,limit,search}}
  )
  return response.data;
}
export const cancelHostedGameRequest=async(gameId:string,reason:string)=>{
  const response =await axiosInstance.post(
    `${CLIENT_ROUTE.CANCEL_HOSTED_GAME_REQUEST}/${gameId}`,
    {reason}
  )
  return response.data;
}

export const getHostedGames = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<IHostedGameListResponse> => {
  const response = await axiosInstance.get<IHostedGameListResponse>(
    CLIENT_ROUTE.GET_HOSTED_GAME,
    { params }
  );
  console.log("dataaaaa", response.data);
  return response.data;
};
export const joinHostedGame = async (gameId: string) => {
  const response = await axiosInstance.post(CLIENT_ROUTE.JOIN_HOSTED_GAME, {
    gameId,
  });
  return response.data;
};
export const getHostedGamesById = async (id: string) => {
  console.log("Tomyyy iddd", id);
  const response = await axiosInstance.get(
    `${CLIENT_ROUTE.GET_SINGLE_HOSTED_GAME}/${id}`
  );
  return response.data;
};

export const getMyChatGroups = async () => {
  const response = await axiosInstance.get(`${CLIENT_ROUTE.MY_CHAT_GROUPS}`);
  return response.data;
};
export const getChatPageData = async (
  groupId: string
): Promise<ChatPageData> => {
  const response = await axiosInstance.get(
    `${CLIENT_ROUTE.GET_CHATS}/${groupId}`
  );
  return response.data;
};
export const addReview = async (
  payload: IAddReviewPayload
): Promise<IAddReviewResponse> => {
  const response = await axiosInstance.post<IAddReviewResponse>(
    CLIENT_ROUTE.ADD_REVIEW,
    payload
  );
  return response.data;
};
export const addRating =async(
  data:IAddRatingPayload
):Promise<IAddRatingResponse>=>{
  const response =await axiosInstance.post(
    CLIENT_ROUTE.ADD_RATING,
    data
  )
  return response.data;
}

export const getTurfReviews =async (turfId:string,page=1,limit=5):Promise<ITurfReviewResponse>=>{
  const response =await axiosInstance.get<{
    success:boolean;
    reviews:ITurfReview[];
    total:number;
    page:number;
    totalPages:number;
  }>(
    `${CLIENT_ROUTE.GET_TURF_REVIEWS}/${turfId}`,{
      params:{page,limit},
    }
  )
  return response.data
}
export const getTurfRatings =async(
  turfId:string,
  page =1,
  limit=5

):Promise<ITurfRatingResponse>=>{
  const response =await axiosInstance.get(
    `${CLIENT_ROUTE.GET_TURF_RATINGS}/${turfId}`,
    {
      params:{page,limit}
    }
  )
  return response.data
}

export const getTurfsByLocation = async (
  latitude: number,
  longitude: number,
  params: GetTurfsParams = {}
): Promise<ITurffResponse> => {
  try {
    const response = await axiosInstance.get<ITurffResponse>(
      CLIENT_ROUTE.GETNEARBYTURF,
      {
        params: {
          params: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
          status: params.status || "",
          latitude: latitude,
          longitude: longitude,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getTurfs:", error);
    throw error;
  }
};
