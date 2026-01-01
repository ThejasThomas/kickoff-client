export interface HostedPlayerDTO {
  userId: string;
  status: "pending" | "paid" | "cancelled";
  paymentId?: string;
  joinedDate?: Date;
}

export interface HostedGameDTO {
  _id: string;
  hostUserId: string;
  turfId: string;
  courtType: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  gameStartAt: Date;
  pricePerPlayer: number;
  capacity: number;
  status: "open" | "full" | "cancelled" | "completed"|"pending_cancel";
  players: HostedPlayerDTO[];
  createdAt?: Date;
}
