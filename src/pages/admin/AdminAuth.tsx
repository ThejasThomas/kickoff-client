import { useToaster } from "../../hooks/ui/useToaster";
import { useAppDispatch } from "../../store/store";
// import { duration } from "moment/moment"
import { motion } from "framer-motion";
import SignIn from "@/components/auth/SignIn";
import { useLoginMutation } from "@/hooks/auth/useLogin";
// import { data } from "react-router-dom";
import type { IAdmin, ILoginData } from "@/types/User";
import { adminLogin } from "@/store/slices/admin_slice";
import { useNavigate } from "react-router-dom";
// import { error } from "console";

export const AdminAuth = () => {
  const { mutate: loginAdmin, isPending } = useLoginMutation();
  const { errorToast, successToast } = useToaster();
  const dispatch = useAppDispatch();
  let navigate = useNavigate();

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
    </>
  );
};
