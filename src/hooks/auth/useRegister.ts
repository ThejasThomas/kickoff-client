import { signup } from "@/services/auth/authService"
import type { IAxiosResponse } from "@/types/Response";
import type { UserDTO } from "@/types/User";
import { useMutation } from "@tanstack/react-query"

export const useRegisterMutation =()=>{
    return useMutation<IAxiosResponse,Error,UserDTO>({
        mutationFn:signup,
    });
};