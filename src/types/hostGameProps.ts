import type { ISlot } from "./Slot";
import type { ITurf } from "./Turf";

interface HostGameFormProps {
  turf: ITurf;
  selectedDate: string;
  slots: ISlot[];
  onCancel: () => void;
  onSubmit: (data: {
    slotDate: string;
    startTime: string;
    endTime: string;
    courtType: string;
    pricePerPlayer: number;
    slotId: string;
  }) => void;
}
export interface IHostGameCheckoutData {
  turfId: string;
  turfName: string;
  location: string;
  images: string[];

  slotId: string;
  slotDate: string;
  startTime: string;
  endTime: string;

  courtType: string;
  pricePerPlayer: number;

  totalAmount: number; 
}

