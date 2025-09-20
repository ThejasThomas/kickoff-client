import { axiosInstance } from "@/api/private_axios";
import { CLIENT_ROUTE } from "@/constants/client_route";
import type { IBookings } from "@/types/Booking_type";
import type { IAuthResponse, IBookResponse, ITurffResponse, SlotResponse } from "@/types/Response";
import type { ISlot } from "@/types/Slot";
import type { ITurf } from "@/types/Turf";
import type { GetTurfsParams, IClient } from "@/types/User";

export type IUpdateClientData = Pick<
  IClient,
  "fullName" | "email" | "phoneNumber" | "location"
>;

export const refreshClientSession = async (): Promise<IAuthResponse> => {
  const response = await axiosInstance.get<IAuthResponse>(CLIENT_ROUTE.REFRESH_SESSION);
  return response.data;
};
export const getTurfById = async (id: string): Promise<ITurf> => {
  console.log('iddddddd',id)
  const response = await axiosInstance.get<{success: boolean;turf:ITurf}>(
    `${CLIENT_ROUTE.GETURFBYID}/${id}`
  )
  return response.data.turf;
}
export const getSlots = async (turfId:string,date:string):Promise<ISlot[]> =>{
  const response = await axiosInstance.get<SlotResponse>(
    `${CLIENT_ROUTE.GETSLOTS}/${turfId}?date=${date}`
  )
  return response.data.slots
}
export const bookSlots =async (bookData:Partial<IBookings>):Promise<IBookResponse> =>{
  console.log('bookiokkkktheee sloottt',bookData)
   const response= await axiosInstance.post<IBookResponse> (
    CLIENT_ROUTE.BOOKSLOT,
    bookData
   )
   return response.data
}
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
