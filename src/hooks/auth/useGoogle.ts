import { googleAuth } from "@/services/auth/authService";
import type { IAuthResponse } from "@/types/Response";
import { useMutation } from "@tanstack/react-query";

export const useGoogleMutation = () => {
	return useMutation<
		IAuthResponse,
		Error,
		{ credential: string; client_id: string; role: string }
	>({
		mutationFn: googleAuth,
	});
};
