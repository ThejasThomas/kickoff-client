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

  players: {
    userId: string;
    status: "pending" | "paid" | "cancelled";
    paymentId?: string;
    joinedAt?: string;
  }[];

  createdAt: string;
  updatedAt: string;

  // populated data
  turf?: {
    turfName: string;
    location: {
      address: string;
      city: string;
    };
    images: string[];
  };

  hostUser?: {
    name: string;
    email: string;
    phoneNumber?: string;
  };
}