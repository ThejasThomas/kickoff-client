import { getTurfById } from "@/services/TurfOwner/turfOwnerService"
import type { ITurf } from "@/types/Turf"
import { useQuery } from "@tanstack/react-query"

export const useGetTurfById = (id: string) => {
  return useQuery<ITurf, Error>({
    queryKey: ['turf', id],
    queryFn: () => getTurfById(id),
    enabled: !!id,
  })
}