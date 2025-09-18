export interface GenerateSlotsData{
  turfId:string,
  ownerId:string,
  date?:string,
  startTime:string,
  endTime:string,
  slotDuration:number,
  price:number,
  selectedDate?:string,
  endDate?:string;
}