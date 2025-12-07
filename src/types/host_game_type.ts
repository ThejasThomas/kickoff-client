export interface IHostedGamePlayer {
  userId: string;
  status: "pending" | "paid" | "cancelled";
  joinedAt?: string;

  user?: {
    name: string;
    email: string;
    phoneNumber?: string;
  } | null;
}

export interface IHostedGameItem {
  _id: string;
  hostUserId: string;
  turfId: string;
  courtType: string;

  slotDate: string;
  startTime: string;
  endTime: string;

  pricePerPlayer: number;
  capacity: number;
  status: "open" | "full" | "cancelled" | "completed";

  players: IHostedGamePlayer[];

  createdAt: string;
  updatedAt: string;

  turf?: {
    turfName: string;
    location: {
      address: string;
      city: string;
    };
    images: string[];
  } | null;

  hostUser?: {
    name: string;
    email: string;
    phoneNumber?: string;
  } | null;
}
