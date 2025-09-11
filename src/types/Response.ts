import type { ITurf, ITurfBase } from "./Turf";
import type { IAdmin, IClient, ITurfOwner, UserDTO } from "./User";

export interface IAxiosResponse {
    success:boolean;
    message:string;
}
export interface IAuthResponse extends IAxiosResponse {
    user:UserDTO
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
export type IAdminResponse = {
  success: boolean;
  message: string;
  user: IAdmin;
};
export type ITurfResponse = {
  success:boolean;
  message:string;
  turf:ITurfBase
  
}
export type ITurffResponse =  {
 success:boolean;
  message:string;
  turfs:ITurf[]
  totalPages:number;
  currentPage:number
}