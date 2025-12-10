import SignIn from "@/components/auth/SignIn";
import { TurfOwnerSignUp } from "@/components/turfOwner/auth/TurfOwnerSignUp";
import { useGoogleMutation } from "@/hooks/auth/useGoogle";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { useToaster } from "@/hooks/ui/useToaster";
// import { googleAuth } from "@/services/auth/authService"
import { clientLogin } from "@/store/slices/client_slice";
import { turfOwnerLogin } from "@/store/slices/turfOwner_slice";
import { useAppDispatch } from "@/store/store";
import type { IClient, ILoginData, ITurfOwner } from "@/types/User";
import type { CredentialResponse } from "@react-oauth/google";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const TurfOwnerAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { errorToast, successToast } = useToaster();

  const { mutate: loginTurfOwner, isPending: isLoginPending } =
    useLoginMutation();
  const { mutate: registerBarber, isPending } = useRegisterMutation();
  const { mutate: googleLogin } = useGoogleMutation();
  const googleAuth = (credentialResponse: CredentialResponse) => {
    googleLogin(
      {
        credential: credentialResponse.credential as string,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        role: "turfOwner",
      },
      {
        onSuccess: (data) => {
          successToast(data.message);
          dispatch(clientLogin(data.user as IClient));
          navigate("/turfOwner/owner-earnings");
        },
        onError: (error: any) => errorToast(error.response.data.message),
      }
    );
  };

  const handleSignUpSubmit = (data: Omit<ITurfOwner, "role">) => {
    registerBarber(
      { ...data, role: "turfOwner" },
      {
        onSuccess: (data) => successToast(data.message),
        onError: (error: any) => {
          errorToast(error.response.data.message);
        },
      }
    );
  };
  const handleLoginSubmit = (data: Omit<ILoginData, "role">) => {
    loginTurfOwner(
      { ...data, role: "turfOwner" },
      {
        onSuccess: (data) => {
          successToast(data.message);
          dispatch(turfOwnerLogin(data.user as ITurfOwner));
          navigate("/turfOwner/home");
        },
        onError: (error: any) => {
          errorToast(error.response.data.message);
        },
      }
    );
  };
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {isLogin ? (
            <SignIn
              isLoading={isLoginPending}
              userType="turfOwner"
              onSubmit={handleLoginSubmit}
              setRegister={() => setIsLogin(false)}
              handleGoogleAuth={googleAuth}
            />
          ) : (
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
  );
};
