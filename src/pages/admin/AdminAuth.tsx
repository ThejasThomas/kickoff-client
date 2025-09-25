import { useToaster } from "../../hooks/ui/useToaster";
import { useAppDispatch } from "../../store/store";
import { motion } from "framer-motion";
import SignIn from "@/components/auth/SignIn";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import type { IAdmin, ILoginData } from "@/types/User";
import { adminLogin } from "@/store/slices/admin_slice";
import { useNavigate } from "react-router-dom";
import { AnimatePresence  } from "framer-motion"


export const AdminAuth = () => {
  const { mutate: loginAdmin, isPending } = useLoginMutation();
  const { errorToast, successToast } = useToaster();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = (data: Omit<ILoginData, "role">) => {
    loginAdmin(
      { ...data, role: "admin" },
      {
        onSuccess: (data) => {
          successToast(data.message);
          dispatch(adminLogin(data.user as IAdmin));
          navigate("/admin/dashboard");
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
        key={"login"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 20 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <SignIn
          handleGoogleAuth={() => {}}
          userType="admin"
          onSubmit={handleLoginSubmit}
          isLoading={isPending}
        />
      </motion.div>
      </AnimatePresence>
    </>
  );
};
