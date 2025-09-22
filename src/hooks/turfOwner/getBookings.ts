import { getusersBookings } from "@/services/TurfOwner/turfOwnerService"
import type { IBookResponse } from "@/types/Response"

import { useMutation } from "@tanstack/react-query"

export const useGetUsersBookings =()=>{
    return useMutation<IBookResponse,Error,{ turfId: string; date: string }>({
        mutationFn:getusersBookings
    })
}