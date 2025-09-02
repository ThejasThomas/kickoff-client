export interface ITurfBase {
  ownerId?: string;
  turfName: string;
  description: string;
  location: {
    address: string;
    city: string;
    state?: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
  };

  amenities: string[];
  images: string[];
  contactNumber: string;
  status: "active" | "inactive" | "approved" | "rejected"|"pending"| "blocked"
  createdAt?: Date;
  updatedAt?: Date;
  pricePerHour: string;
  courtType: string;
}

export interface TurfFormValues {}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}
export interface ITurf extends ITurfBase {
  _id: string;
}

export type NewTurf = ITurfBase & { _id?: string };
