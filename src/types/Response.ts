import type { ISlot } from "./Slot";
import type { ITurf, ITurfBase } from "./Turf";
import type { IAdmin, IClient, ITurfOwner, UserDTO } from "./User";
import type { IBookings } from "./Booking_type";
import type { IRules } from "./rules_type";
import type { IWalletTransaction } from "./wallet_type";

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

export interface IGenerateRulesResponse{
  message:string
  success:boolean;
  rules:IRules
}


export  interface SlotResponse {
  success:boolean;
  slots:ISlot[]
}



export interface IBookResponse {
  success:boolean,
  message:string,
  bookings:IBookings[]
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface GetUpcomingBookings{
  page?:number;
  limit?:number;
  search?:string;
}


export interface IAddMoneyResponse{
  success:boolean;
  message:string;
  transaction:IWalletTransaction
}

export interface IWalletHistoryResponse {
  success: boolean;
  transactions: IWalletTransaction[];
  total:number;
  page:number;
  limit:number
}

export interface IWalletBalanceResponse {
  success:boolean;
  balance:number
}