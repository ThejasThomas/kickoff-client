export interface ICancelRequestItem {
  _id: string;
  bookingId: string;
  userId: string;
  ownerId: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;

  booking?: {
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    turfId: string;
  };

  user?: {
    name: string;
    email: string;
    phone?: string;
  };
}


