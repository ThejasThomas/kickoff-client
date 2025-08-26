import { useMutation, type MutationFunction } from "@tanstack/react-query";

export const useLogout = <T>(mutationFn:MutationFunction<T>) => {
    return useMutation<T,unknown,void>({
        mutationFn
    })
}