export interface IBlockedSlot {
  _id?: string;
  turfId: string;
  date: string;       
  startTime: string;  
  endTime: string;    
  reason?: string;
  createdAt?: string;
}
