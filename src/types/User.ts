import type { ITurf } from "./Turf";
import type { UserRoles } from "./UserRoles";

type statusTypes = "active" | "pending" | "blocked"|"rejected"|"approved"

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
  profileImage?: string|File
  ownerName?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  googleId?: string;
  rejectionReason?: string;
}
export interface GetUsersParams {
  role?: "client" | "turfOwner";
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  excludeStatus?: string | string[];
}

export interface GetTurfsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  excludeStatus?: string[];
}

export interface GetAllUsersResponse<> {
  success: boolean;
  users: User[] | ITurfOwner[];
  totalPages: number;
  currentPage: number;
  message?: string;
}
export interface GetAllTurfsResponse {
  success: boolean;
  message: string;
  turfs: ITurf[];
  totalPages: number;
  currentPage: number;
}

export type UserDTO = IAdmin | IClient | ITurfOwner;
