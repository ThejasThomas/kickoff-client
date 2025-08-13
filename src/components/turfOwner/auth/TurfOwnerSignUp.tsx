// import { PublicHeader } from "@/components/mainComponents/PublicHeader";
import { useSendOTPMutation } from "@/hooks/auth/useSendOTP";
import { useToaster } from "@/hooks/ui/useToaster";
import { motion } from "framer-motion";
import type { ITurfOwner } from "@/types/User";
import type { UserRoles } from "@/types/UserRoles";
import { turfOwnerSchema } from "@/utils/validations/turfOwner_signup_validation";
import { useFormik } from "formik";
import { useState } from "react";
// import { GoogleAuthButton } from "@/components/auth/GoogleAuth";
// import MuiButton from "@/components/common/buttons/MuiButton";
import { LocationInputField } from "@/components/common/fields/LocationInputField";
// import { MuiTextField } from "@/components/common/fields/MuiTextField";
import { useVerifyOTPMutation } from "@/hooks/auth/useVerifyOtp";
import OTPModal from "@/components/modals/OTPModal";
import { Eye, EyeOff, Lock, Mail, MapPin, Phone } from "lucide-react";
import SignUpImg from '../../../assets/common/kickoff-auth-image.jpg'

interface SignUpProps {
  userType: UserRoles;
  onSubmit: (data: ITurfOwner) => void;
  setLogin?: () => void;
  isLoading: boolean;
}

export const TurfOwnerSignUp = ({
  onSubmit,
  setLogin,
  isLoading,
}: SignUpProps) => {
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [userData, setUserData] = useState<ITurfOwner>({} as ITurfOwner);
  const [isSending, setIsSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: sendVerificationOTP, isPending: isSendOtpPending } =
    useSendOTPMutation();
  const { mutate: verifyOTP, isPending: isVerifyOtpPending } =
    useVerifyOTPMutation();

  const { successToast, errorToast } = useToaster();

  const submitRegister = () => {
    onSubmit(userData);
  };

  const handleOpenOTPModal = () => {
    setIsOTPModalOpen(true);
  };

  const handleCloseOTPModal = () => {
    setIsOTPModalOpen(false);
  };

  const handleSendOTP = (email?: string) => {
    setIsSending(() => true);
    sendVerificationOTP(email ?? userData.email, {
      onSuccess(data) {
        successToast(data.message);
        setIsSending(false);
        handleOpenOTPModal();
      },
      onError(error: any) {
        errorToast(error.response.data.message);
      },
    });
  };

  const handleVerifyOTP = (otp: string) => {
    verifyOTP(
      { email: userData.email, otp },
      {
        onSuccess() {
          submitRegister();
          handleCloseOTPModal();
          formik.resetForm();
        },
        onError(error: any) {
          errorToast(error.response.data.message);
        },
      }
    );
  };

  const formik = useFormik<
    ITurfOwner & { password: string; confirmPassword: string }
  >({
    initialValues: {
      turfName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      geoLocation: {
        type: "Point",
        coordinates: [],
      },
      location: {
        name: "",
        displayName: "",
        zipCode: "",
      },
    },
    validationSchema: turfOwnerSchema,
    onSubmit: (values) => {
      if (
        values.geoLocation?.coordinates?.length === 0 ||
        !values.location?.zipCode ||
        !values.location?.name ||
        !values.location?.displayName
      ) {
        errorToast("Please select a proper location");
        return;
      }
      setUserData({
        ...values,
        status: "pending",
      });
      handleSendOTP(values.email);
    },
  });

  const handleLocationSelect = (location: {
    name: string;
    zipCode: string;
    displayName: string;
    latitude: number | null;
    longitude: number | null;
  }) => {
    formik.setFieldValue("geoLocation", {
      type: "Point",
      coordinates: [location.longitude, location.latitude],
    });
    formik.setFieldValue("location", {
      name: location.name,
      displayName: location.displayName,
      zipCode: location.zipCode,
    });
  };

  const backgroundImageSrc = SignUpImg

  return (
    <>
      {/* <PublicHeader /> */}
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
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
          className="w-full max-w-lg bg-teal-500/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative z-10 max-h-[90vh] overflow-y-auto"
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
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Apply for Turf Owner
            </h1>
            <p className="text-white/80 text-sm">
              Join TurfBooker Pro as a Partner!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Turf Name */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="turfName"
                placeholder="Enter your turf name"
                value={formik.values.turfName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300"
              />
              {formik.touched.turfName && formik.errors.turfName && (
                <p className="text-red-300 text-xs mt-1">
                  {formik.errors.turfName}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter your phone number"
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

            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <Mail className="w-4 h-4" />
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

            {/* Password */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <Lock className="w-4 h-4" />
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-300 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <Lock className="w-4 h-4" />
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-300 text-xs mt-1">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                <LocationInputField
                  onSelect={handleLocationSelect}
                  initialValue={formik.values?.location?.name}
                  placeholder="Search for your turf location"
                  disabled={isLoading}
                  onChange={(value) => {
                    formik.setFieldValue("location.name", value);
                  }}
                />
              </div>
              {formik.values.location?.name && formik.errors.location && (
                <p className="text-red-300 text-xs mt-1">
                  Please select a valid location
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
                  Login Now!
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
                  Applying...
                </div>
              ) : (
                "Apply Now!"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={handleCloseOTPModal}
        onVerify={async (otp) => {
          handleVerifyOTP(otp);
          return true;
        }}
        onResend={() => handleSendOTP(userData.email)}
        isSending={isSending}
      />
    </>
  );
};
