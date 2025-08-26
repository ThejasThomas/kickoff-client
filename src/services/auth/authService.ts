import { authAxiosInstance } from "@/api/auth_axios";
import { clientAxiosInstance } from "@/api/client_axios";
import { turfOwnerAxiosInstance } from "@/api/turfOwner_axios";
import type { IAuthResponse, IAxiosResponse } from "@/types/Response";
import type { ILoginData, UserDTO } from "@/types/User";

export const signup =async (user:UserDTO):Promise<IAxiosResponse> =>{
    const response =await authAxiosInstance.post<IAxiosResponse>(
        '/signup',
        user
    )
    return response.data;
}

export const signin =async (user:ILoginData):Promise<IAuthResponse> =>{
    const response =await authAxiosInstance.post<IAuthResponse>(
        '/signin',
        user
    );
    return response.data;
}

export const logoutClient =async ():Promise<IAxiosResponse> => {
	const response = await clientAxiosInstance.post('/client/logout')
	return response.data;
}

export const logoutTurfOwner =async ():Promise<IAxiosResponse>=>{
	const response = await turfOwnerAxiosInstance.post('turfOwner/logout')
	return response.data;
}

export const sendOtp = async (email: string): Promise<IAxiosResponse> => {
	const response = await authAxiosInstance.post<IAxiosResponse>("/send-otp", {
		email,
	});
	return response.data;
};

export const verifyOtp = async (data: {
	email: string;
	otp: string;
}): Promise<IAxiosResponse> => {
	const response = await authAxiosInstance.post<IAxiosResponse>(
		"/verify-otp",
		data
	);
	return response.data;
};
export const googleAuth = async ({
	credential,
	client_id,
	role,
}: {
	credential: string;
	client_id: string;
	role: string;
}): Promise<IAuthResponse> => {
	const response = await authAxiosInstance.post<IAuthResponse>(
		"/google-auth",
		{
		 credential,
		 client_id,
		 role,
		 }
	);
	return response.data;
};

export const forgotPassword =async ({
	email,
	role,
}:{
	email:string;
	role:string
})=>{
	const response = await authAxiosInstance.post<IAxiosResponse>(
		"/forgot-password",
		{
			email,
			role,
		}
	)
	return response.data;
}

export const resetPassword =async ({
	password,
	role,
	token,
}: {
	password:string;
	role:string
	token:string|undefined;
}) => {
	const response =await authAxiosInstance.post<IAxiosResponse>(
		"/reset-password",
		{
			password,
			role,
			token
		}
	)
	return response.data;
}