export interface IAddReviewPayload {
  bookingId: string;
  turfId: string;
  comment: string;
}
export interface IAddRatingPayload {
  bookingId:string;
  turfId:string;
  rating:number
}
export interface IRating {
  _id: string;
  userId: string;
  turfId: string;
  bookingId: string;
  rating: number;
  hasRated: boolean;
  createdAt: string;
  updatedAt: string;
}
