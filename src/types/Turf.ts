export interface ITurf {
  ownerId?: string;
  turfName: string;
  description: string;
  location: {
    address: string;
    city: string;
    state?: string;
    coordinates: {
      type:string;
      coordinates: [number, number];
    };
  };

  amenities: string[];
  images: string[];
  contactNumber: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
  pricePerHour: string;
  courtType: string;
}


export interface TurfFormValues {
  
}


export interface LocationCoordinates {
  lat:number
  lng:number
}
