export interface ISlot {
    id:string,
    turfId:string,
    ownerId:string,
    date:string,
    duration:number,
    price:number,
    startTime:string,
    endTime:string,
    isBooked?:boolean;
}