import { addTurf } from "@/services/TurfOwner/turfOwnerService"
import type { ITurfResponse } from "@/types/Response"
import type { ITurfBase } from "@/types/Turf"
import { useMutation } from "@tanstack/react-query"

export const useAddTurfMutation = () =>{
    return useMutation<ITurfResponse,Error,ITurfBase>({
        mutationFn:addTurf
    })
}