import SignIn from "@/components/auth/SignIn"
import { TurfOwnerSignUp } from "@/components/turfOwner/auth/TurfOwnerSignUp"
import { useLoginMutation } from "@/hooks/auth/useLogin"
import { useRegisterMutation } from "@/hooks/auth/useRegister"
import { useToaster } from "@/hooks/ui/useToaster"
// import { googleAuth } from "@/services/auth/authService"
import { turfOwnerLogin } from "@/store/slices/turfOwner_slice"
import { useAppDispatch } from "@/store/store"
import type { ILoginData, ITurfOwner } from "@/types/User"
import { AnimatePresence , motion } from "framer-motion"
import { useState } from "react"
import { data, useNavigate } from "react-router-dom"

export const TurfOwnerAuth =()=>{
    const [isLogin,setIsLogin]=useState(false)
    const dispatch=useAppDispatch()
    const navigate=useNavigate();

    const {errorToast,successToast} =useToaster();

    const { mutate: loginTurfOwner, isPending: isLoginPending } =useLoginMutation()
    const { mutate: registerBarber, isPending } = useRegisterMutation();

    const handleSignUpSubmit =(data:Omit<ITurfOwner,'role'>)=>{
        registerBarber(
            { ...data,role:'turfOwner'},
            {
                onSuccess:(data) =>successToast(data.message),
                onError:(error:any) =>{
                    errorToast(error.response.data.message)
                }
            }
        )
    }
    const handleLoginSubmit=(data: Omit<ILoginData,'role'>)=>{
         loginTurfOwner(
            { ...data,role:'turfOwner'},
            {
                onSuccess:(data) => {
                    successToast(data.message);
                    dispatch(turfOwnerLogin(data.user as ITurfOwner))
                    navigate('/turfOwner/home')
                },
                onError:(error: any)=>{
                    errorToast(error.response.data.message)
                },
            }
         )
    }
    return(
        <>
            <AnimatePresence mode="wait">
                <motion.div
            key={isLogin?'login':'signup'}
            initial={{ opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-20}}
            transition={{duration:0.5}}>
                {isLogin?(
                   <SignIn isLoading={isLoginPending}
                   userType="turfOwner"
                   onSubmit={handleLoginSubmit}
                   setRegister={()=>setIsLogin(false)}
                   /> ):(

        <TurfOwnerSignUp
            isLoading={isPending}
            userType="turfOwner"
            onSubmit={handleSignUpSubmit}
            setLogin={() => setIsLogin(true)}
        />
        
        )}
                </motion.div>

            </AnimatePresence>
            </>

    )
}