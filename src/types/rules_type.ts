export interface ITimeRange {
    startTime:string,
    endTime:string
}

export interface IException{
    date:string;
}
export interface IWeekRules {
    [key:string]:ITimeRange[];
}

export interface IRules {
    turfId:string,
    ownerId:string,
    slotDuration:number,
    price:number,
    weeklyRules:IWeekRules[]
    exceptions:IException[]
}