import SignIn from "@/components/auth/SignIn";
import ClientSignUp from "@/components/client/auth/clientSignUp";
import { useGoogleMutation } from "@/hooks/auth/useGoogle";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { useToaster } from "@/hooks/ui/useToaster";
import { clientLogin } from "@/store/slices/client_slice";
import { useAppDispatch } from "@/store/store";
import type { IClient, ILoginData, User } from "@/types/User";
import type { CredentialResponse } from "@react-oauth/google";
// import { error } from "console";
import { AnimatePresence,motion } from "framer-motion";
import { useState } from "react"
import { useNavigate } from "react-router-dom";


export const ClientAuth = ()=>{
    const [isLogin,setIsLogin] = useState(true)
    const dispatch = useAppDispatch();
    const navigate=useNavigate()
    	const { mutate: googleLogin } = useGoogleMutation();


    const {mutate:loginClient,isPending:isLoginPending} =useLoginMutation();
    const {mutate:registerClient,isPending} =useRegisterMutation();
    // const {mutate:g}

    const {errorToast,successToast} =useToaster();
    const googleAuth = (credentialResponse: CredentialResponse) => {
		googleLogin(
			{
				credential: credentialResponse.credential as string,
				client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
				role: "client",
			},
			{
				onSuccess: (data) => {
					successToast(data.message);
					dispatch(clientLogin(data.user as IClient));
					navigate("/home");
				},
				onError: (error: any) =>
					errorToast(error.response.data.message),
			}
		);
	};

    const handleSignUpSubmit =(data:Omit<User,'role'>)=> {
        registerClient(
            {...data,role:'client'},
            {
                onSuccess:(data) =>successToast(data.message),
                onError:(error:any) =>errorToast(error.response.data.message),
            }
        )
    }
    


const handleLoginSubmit =(data:Omit<ILoginData,'role'>)=>{
    loginClient(
        {...data,role:'client'},
        {
            onSuccess:(data)=>{
                successToast(data.message);
                dispatch(clientLogin(data.user as IClient))
                navigate('/home')
            },
            onError:(error:any)=>{
                errorToast(error.response.data.message)
            }
        }
    )

}

return (
    <>
    <AnimatePresence mode="wait">
        <motion.div
            key={isLogin?'login':'signup'}
            initial={{ opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-20}}
            transition={{duration:0.5}}>
                {isLogin?(
                    <SignIn
                        isLoading={isLoginPending}
                        userType='client'
                        onSubmit={handleLoginSubmit}
                        setRegister={()=>{setIsLogin(false)}}
                        handleGoogleAuth={googleAuth}
                        />
                    ):(
                       <ClientSignUp
							isLoading={isPending}
							userType="client"
							onSubmit={handleSignUpSubmit}
							setLogin={() => setIsLogin(true)}
							handleGoogleAuth={googleAuth}
						/>    
                )}
        </motion.div>

    </AnimatePresence>
    </>
)
}