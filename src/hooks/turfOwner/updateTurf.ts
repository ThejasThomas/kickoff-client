// src/hooks/turfOwner/updateTurf.ts
import { useMutation } from "@tanstack/react-query";
import type { ITurf, NewTurf } from "@/types/Turf";
import { updateTurf } from "@/services/TurfOwner/turfOwnerService";

interface UpdateTurfParams {
  id: string;
  data: Partial<NewTurf>;
}

export const useUpdateTurf = () => {
  return useMutation<ITurf, Error, UpdateTurfParams>({
    mutationFn: ({ id, data }) => updateTurf(id, data),
  });
};