import { useState } from "react";
import { motion } from "framer-motion";
import type { CredentialResponse } from "@react-oauth/google";
import { useFormik } from "formik";
import type { User } from "@/types/User";
import type { UserRoles } from "@/types/UserRoles";
import { useToaster } from "@/hooks/ui/useToaster";
import { clientSignupSchema } from "@/utils/validations/client_signup.validation";
import { useSendOTPMutation } from "@/hooks/auth/useSendOTP";
import { useVerifyOTPMutation } from "@/hooks/auth/useVerifyOtp";
import OTPModal from "@/components/modals/OTPModal";
import { GoogleAuthButton } from "@/components/auth/GoogleAuth";
import SignUpImg from "../../../assets/common/kickoff-auth-image.jpg";
import { useNavigate } from "react-router-dom";

interface SignUpProps {
  userType: UserRoles;
  onSubmit: (data: User) => void;
  setLogin?: () => void;
  isLoading: boolean;
  handleGoogleAuth: (credential: CredentialResponse) => void;
}

interface ClientSignupFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const ClientSignUp = ({
  onSubmit,
  setLogin,
  isLoading,
  handleGoogleAuth,
}: SignUpProps) => {
  const navigate = useNavigate();
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { successToast, errorToast } = useToaster();

  const { mutate: sendVerificationOTP, isPending: isSendOtpPending } =
    useSendOTPMutation();
  const { mutate: verifyOTP, isPending: isVerifyOtpPending } =
    useVerifyOTPMutation();

  const handleSendOTP = (email?: string) => {
    if (!email && !userData.email) return;
    setIsSending(true);
    sendVerificationOTP(email ?? userData.email!, {
      onSuccess: (data) => {
        successToast(data.message);
        setIsSending(false);
        setIsOTPModalOpen(true);
      },
      onError: (error: any) => {
        errorToast(error.response?.data?.message || "Failed to send OTP");
        setIsSending(false);
      },
    });
  };

  const handleVerifyOTP = async (otp: string): Promise<boolean> => {
    if (!userData.email) {
      errorToast("Email is missing. Try again.");
      return false;
    }

    const email = userData.email as string; // Type assertion since we've checked it's not undefined

    return new Promise((resolve) => {
      verifyOTP(
        { email, otp },
        {
          onSuccess: () => {
            successToast("OTP verified successfully!");
            setIsOTPModalOpen(false);
            onSubmit(userData as User);
            navigate("/");
            resolve(true);
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message || error?.message || "Invalid OTP";
            errorToast(errorMessage);
            resolve(false);
          },
        }
      );
    });
  };

  const formik = useFormik<ClientSignupFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: clientSignupSchema,
    onSubmit: (values) => {
      setUserData(values);
      handleSendOTP(values.email);
    },
  });

  const handleCloseOTPModal = () => {
    setIsSending(false);
    setIsOTPModalOpen(false);
  };

  const backgroundImageSrc = SignUpImg;

  return (
    <>
      {/* <PublicHeader /> */}
      <div
        className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('${backgroundImageSrc}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-green-800/30 to-emerald-900/40"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              animate={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-teal-500/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative z-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(20, 184, 166, 0.25) 0%, rgba(5, 150, 105, 0.25) 100%)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-teal-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-white/20"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Create Your Account
            </h1>
            <p className="text-white/80 text-sm">Join TurfBooker Pro Today!</p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Fury"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-red-300 text-xs mt-1">
                    {formik.errors.fullName}
                  </p>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter your phone"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300"
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-red-300 text-xs mt-1">
                    {formik.errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-300 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password field with toggle */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 pl-10 pr-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors duration-200"
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-300 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password field with toggle */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 pl-10 pr-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors duration-200"
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-300 text-xs mt-1">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            <div className="text-center pt-2">
              <span className="text-white/80 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={setLogin}
                  className="text-teal-300 font-medium hover:text-teal-200 transition-colors underline"
                >
                  Sign In Now!
                </button>
              </span>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || isSendOtpPending || isVerifyOtpPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            >
              {isLoading || isSendOtpPending || isVerifyOtpPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-teal-500/20 text-white/80 rounded-full backdrop-blur-sm">
                  OR
                </span>
              </div>
            </div>

            {/* Google Auth */}
            <GoogleAuthButton handleGoogleSuccess={handleGoogleAuth} />
          </form>
        </motion.div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={handleCloseOTPModal}
        onVerify={handleVerifyOTP}
        onResend={() => handleSendOTP(userData.email)}
        isSending={isSending}
      />
    </>
  );
};

export default ClientSignUp;
