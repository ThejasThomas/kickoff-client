import type { UserRoles } from "./UserRoles";

type statusTypes = "active" | "pending" | "blocked";

export type userStatus = "active" | "blocked";
export type turfOwnerStatus = "pending" | "approved" | "rejected" | "blocked";

export interface User {
  userId?: string;
  fullName: string;
  email: string;
  role?: UserRoles;
  phoneNumber: string;
  status?: statusTypes;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILoginData {
  email: string;
  password: string;
  role: UserRoles;
}

export interface IAdmin extends User {
  
}

export interface IClient extends User {
  googleId?: string;
  geoLocation?: {
    type?: "Point";
    coordinates?: number[];
  };
  location?: {
    name?: string;
    displayName?: string;
    zipCode?: string;
  };
}

export interface ITurfOwner extends Omit<User, "fullName" | "userId"> {
  _id: string
  userId: string;

  ownerName?: string;
  // description?:string;
  googleId?: string;
  // distance?:number;
  // amenities?: {
  //     Parking:boolean;
  //     ChangingRooms:boolean;
  //     DrinkingWater:boolean;
  //     WashingRooms:boolean;
  //     Wifi:boolean;
  // },
  rejectionReason?: string;
  // geoLocation?: {
  //     type?:'Point';
  //     coordinates?:number[];
  // }
  // location?: {
  //     name?:string;
  //     displayName?:string;
  //     zipCode?:string;
  // }
}
export interface GetUsersParams {
  role?: "client" | "turfOwner";
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  excludeStatus?: string | string[];
}

export interface GetAllUsersResponse<T = any> {
  success: boolean;
  users: User[] | ITurfOwner[];
  totalPages: number;
  currentPage: number;
  message?: string;
}

export type UserDTO = IAdmin | IClient | ITurfOwner;
