import { useForgotPasswordMutation } from "@/hooks/auth/useForgotPassword";
import { useToaster } from "@/hooks/ui/useToaster";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicHeader } from "../mainComponents/PublicHeader";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import MuiButton from "../common/buttons/MuiButton";
import { MuiTextField } from "../common/fields/MuiTextField";
import { useFormik } from "formik";
import { emailSchema } from "@/utils/validations/email.validator";

interface ForgotPasswordProps {
  role: string;
  signInPath: string;
}

const ForgotPassword = ({ role, signInPath }: ForgotPasswordProps) => {
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();

  const {
    mutate: forgotPassReq,
    isPending,
    isError,
    isSuccess,
  } = useForgotPasswordMutation();
  const { successToast, errorToast } = useToaster();

  const handleForgotPasswordSubmit = ({ email }: { email: string }) => {
    forgotPassReq(
      { email, role },
      {
        onSuccess: (data) => {
          successToast(data.message);
          setEmailSent(true);
        },
        onError: (error: any) => {
          errorToast(error.response.data.message);
        },
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailSchema,
    onSubmit: (values) => {
      handleForgotPasswordSubmit({ ...values });
    },
  });

  return (
    <>
      <PublicHeader />
      {/* Left Section With Image */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex md:w-1/2 h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden"
      ></motion.div>

      {/* Right-section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto w-full space-y-8"
      >
        <button onClick={() => navigate(signInPath)}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back To Sign In
        </button>
        {emailSent && !isPending && !isError && isSuccess ? (
          // Success State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Check your email
              </h2>
              <p className="text-muted-foreground">
                We've sent a password reset link to{" "}
                <strong>{formik.values.email}</strong>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or
              <button
                type="button"
                onClick={() => setEmailSent(false)}
                className="text-[var(--yellow)] hover:text-[var(--yellow-hover)] ml-1"
              >
                try again
              </button>
            </p>
          </motion.div>
        ) : (
          // Form State
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Forgot your password?
              </h2>
              <p className="text-muted-foreground mt-2">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            <form className="space-y-4" onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-4">
                {/* Email */}
                <MuiTextField
                  id="email"
                  name="email"
                  type="email"
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email ? formik.errors.email : ""}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Email"
                  placeholder="Enter your email"
                />
              </div>

              {/* Submit Button */}
              <MuiButton
                disabled={isPending}
                loading={isPending}
                type="submit"
                fullWidth
                variant="yellow"
              >
                Send Reset Link
              </MuiButton>
            </form>
          </>
        )}
      </motion.div>
    </>
  );
};

export default ForgotPassword;
