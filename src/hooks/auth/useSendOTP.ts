import { sendOtp } from "@/services/auth/authService";
import type { IAxiosResponse } from "@/types/Response";
import type { SendOtpPayload } from "@/types/User";
import { useMutation } from "@tanstack/react-query";

export const useSendOTPMutation = () => {
	return useMutation<IAxiosResponse, Error, SendOtpPayload>({
		mutationFn: sendOtp,
	});
	
};
