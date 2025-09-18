export interface ISlot {
    turfId:string,
    ownerId:string,
    date:string,
    duration:number,
    price:number,
    startTime:string,
    endTime:string,
    isBooked?:boolean;
}