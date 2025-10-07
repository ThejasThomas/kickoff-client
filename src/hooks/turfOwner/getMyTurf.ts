import { getMyTurfs } from "@/services/TurfOwner/turfOwnerService"
import type { GetMyTurfsParams, ITurffResponse } from "@/types/Response"
import { useMutation } from "@tanstack/react-query"

export const useGetMyTurf =() =>{
    return useMutation<ITurffResponse,Error,GetMyTurfsParams>({
        mutationFn:getMyTurfs
    })
}