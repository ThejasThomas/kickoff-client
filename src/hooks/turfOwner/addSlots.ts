import { generateSlots } from "@/services/TurfOwner/turfOwnerService"
import type { IGenerateSlotsResponse } from "@/types/Response"
import type { GenerateSlotsData } from "@/types/Slots"

import { useMutation } from "@tanstack/react-query"

export const useAddSlotMutation =() =>{
    return useMutation<IGenerateSlotsResponse,Error,GenerateSlotsData>({
        mutationFn:generateSlots
    })
}