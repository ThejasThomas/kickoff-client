import type { ISlot } from "./Slot";
import type { ITurf, ITurfBase } from "./Turf";
import type { IAdmin, IClient, ITurfOwner, UserDTO } from "./User";
import type { IBookings } from "./Booking_type";
import type { IRules } from "./rules_type";
import type { IWalletTransaction } from "./wallet_type";
import type { ICancelRequestItem } from "./cancel_requests_type";
import type { IHostedGameItem } from "./host_game_type";
import type { IBlockedSlot } from "./blocked_slot_type";
import type { OwnerWalletTransaction } from "./ownerWallet_transactions";
import type { ITurfReview } from "./turfReview_type";
import type { AdminWalletTransaction } from "./admin_wallet_type";
import type { IRating } from "./addReview_type";
import type { ITurfRating } from "./turf_rating_type";

export interface IAxiosResponse {
  success: boolean;
  message: string;
}
export interface IAuthResponse extends IAxiosResponse {
  user: UserDTO;
}
export type IClientResponse = {
  success: boolean;
  message: string;
  user: IClient;
};

export type ITurfOwnerResponse = {
  success: boolean;
  message: string;
  user: ITurfOwner;
};
export type ITurfOwnerDetailsResponse = {
  success: boolean;
  message: string;
  user: ITurfOwner;
};
export type IAdminResponse = {
  success: boolean;
  message: string;
  user: IAdmin;
};
export type ITurfResponse = {
  success: boolean;
  message: string;
  turf: ITurfBase;
};
export type ITurffResponse = {
  success: boolean;
  message: string;
  turfs: ITurf[];
  totalPages: number;
  currentPage: number;
};
export type GetMyTurfsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?:
    | "active"
    | "inactive"
    | "approved"
    | "rejected"
    | "pending"
    | "blocked";
};

export interface IGenerateSlotsResponse {
  message: string;
  slots: ISlot[];
}

export interface IGenerateRulesResponse {
  message: string;
  success: boolean;
  rules: IRules;
}

export interface SlotResponse {
  success: boolean;
  slots: ISlot[];
}

export interface IBookResponse {
  success: boolean;
  message: string;
  bookings: IBookings[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface GetUpcomingBookings {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IAddReviewResponse {
  success: boolean;
  review: {
    _id: string;
    bookingId: string;
    turfId: string;
    comment: string;
    createdAt: string;
  };
}

export interface IAddMoneyResponse {
  success: boolean;
  message: string;
  transaction: IWalletTransaction;
}

export interface IWalletHistoryResponse {
  success: boolean;
  transactions: IWalletTransaction[];
  total: number;
  page: number;
  limit: number;
}

export interface IWalletBalanceResponse {
  success: boolean;
  balance: number;
}
export interface ICancelRequestResponse {
  success: boolean;
  requests:ICancelRequestItem[]
  total:number;
  page:number;
  limit:number;
  totalPages:number;
}

export interface IHandleCancelActionResponse {
  success: boolean;
  message: string;
}
export interface ICreateHostedGameResponse {
  success: boolean;
  message: string;
  game: IHostedGameItem;
}
export interface IHostedGameListResponse {
  success: boolean;
  games: IHostedGameItem[];
}

export interface ICheckSlotAvailabilityResponse {
  success: boolean;
  message: string;
  result: {
    status: "AVAILABLE" | "NORMAL_BOOKED" | "HOSTED_GAME" | "BLOCKED";
    booking?: IBookings;
    hostedGame?: IHostedGameItem;
    blockedSlot?: IBlockedSlot;
  };
}
export interface ICancelSlotResponse {
  success: boolean;
  message: string;
}

export interface IOwnerWalletTransactionResponse {
  success: boolean;
  transactions: OwnerWalletTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ITurfReviewResponse {
  reviews: ITurfReview[];
  total: number;
  page: number;
  totalPages: number;
}
export interface TurfsResponse {
  success: boolean;
  turfs: ITurf[];
  currentPage: number;
  totalPages: number;
}
export interface IAddRatingResponse {
  success: boolean;
  rating: IRating;
}
export interface ITurfRatingResponse {
  success: boolean;
  averageRating: number;
  totalRatings: number;
  ratings: ITurfRating[];
}


export interface AdminWalletTransactionResponse {
  success: boolean;
  transactions: AdminWalletTransaction[];
  total: number;
  page: number;
  totalPages: number;
}