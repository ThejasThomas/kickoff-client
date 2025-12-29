export interface IBookings {
  _id: string;
  turfId: string;
  userId: string;

  startTime: string;
  endTime: string;
  date: string;

  bookingType: "normal" | "hosted_game"|"offline"

  price: number;
  status: "open" | "full" | "cancelled" | "completed" | "confirmed"|"pending"

  paymentStatus: string;   
  paymentMethod:string
  createdAt: string;
  hasReviewed?: boolean;
  hasRated?:boolean

  hostedGameId?:string
}
