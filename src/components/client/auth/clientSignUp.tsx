import { useState } from "react";
import { motion } from "framer-motion";
import type { CredentialResponse } from "@react-oauth/google";
import { useFormik } from "formik";

import { PublicHeader } from "@/components/mainComponents/PublicHeader";
import type { User } from "@/types/User";
import type { UserRoles } from "@/types/UserRoles";
import { useToaster } from "@/hooks/ui/useToaster";
import { clientSignupSchema } from "@/utils/validations/client_signup.validation";

import MuiButton from "@/components/common/buttons/MuiButton";
import { MuiTextField } from "@/components/common/fields/MuiTextField";
import { useSendOTPMutation } from "@/hooks/auth/useSendOTP";
import { GoogleAuthButton } from "@/components/auth/GoogleAuth";
 // Ensure this path is correct
import { useVerifyOTPMutation } from "@/hooks/auth/useVerifyOtp";
import OTPModal from "@/components/modals/OTPModal";

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
	const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [userData, setUserData] = useState<Partial<User>>({});
	const { successToast, errorToast } = useToaster();

	const { mutate: sendVerificationOTP, isPending: isSendOtpPending } =
		useSendOTPMutation();
	const { mutate: verifyOTP, isPending: isVerifyOtpPending } =
		useVerifyOTPMutation();

	// --- Send OTP Function ---
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

	// --- OTP Verification ---
	const handleVerifyOTP = async (otp: string):Promise<boolean> => {
  if (!userData.email) {
    errorToast("Email is missing. Try again.");
    return false;
  }
  try {
    await verifyOTP({ email: userData.email, otp });
    successToast("OTP verified successfully!");
    setIsOTPModalOpen(false);
    onSubmit(userData as User);
    return true;
  } catch (err) {
  errorToast(
    (err as any)?.response?.data?.message || 
    (err as Error)?.message || 
    "Invalid OTP"
  );
  return false;
}
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

	// --- Close Modal ---
	const handleCloseOTPModal = () => {
		setIsSending(false);
		setIsOTPModalOpen(false);
	};

	return (
		<>
			<PublicHeader />
			<motion.div className="min-h-screen flex flex-col md:flex-row">
				{/* Left Section */}
				<motion.div
					initial={{ x: -100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.8 }}
					className="hidden md:flex md:w-1/2 h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"
				/>

				{/* Right Section */}
				<div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="max-w-md mx-auto w-full space-y-8"
					>
						{/* Header */}
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold tracking-tight">
								Create your account
							</h2>
							<p className="text-muted-foreground mt-2">
								Enter your details to get started 
							</p>
						</div>

						{/* Form */}
						<form onSubmit={formik.handleSubmit} className="space-y-2">
							<div className="flex flex-col gap-3.5">
								{/* Full Name + Phone */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<MuiTextField
										id="fullName"
										name="fullName"
										label="Full Name"
										placeholder="John Fury"
										value={formik.values.fullName}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										error={formik.touched.fullName && Boolean(formik.errors.fullName)}
										helperText={formik.touched.fullName ? formik.errors.fullName : ""}
									/>
									<MuiTextField
										id="phoneNumber"
										name="phoneNumber"
										label="Phone"
										placeholder="Enter your phone"
										value={formik.values.phoneNumber}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										error={
											formik.touched.phoneNumber &&
											Boolean(formik.errors.phoneNumber)
										}
										helperText={
											formik.touched.phoneNumber
												? formik.errors.phoneNumber
												: ""
										}
									/>
								</div>

								{/* Email */}
								<MuiTextField
									id="email"
									name="email"
									type="email"
									label="Email"
									placeholder="Enter your email"
									value={formik.values.email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.email && Boolean(formik.errors.email)}
									helperText={formik.touched.email ? formik.errors.email : ""}
								/>

								{/* Password + Confirm Password */}
								<MuiTextField
									id="password"
									name="password"
									label="Password"
									type="password"
									placeholder="Create password"
									isPassword
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.password && Boolean(formik.errors.password)}
									helperText={formik.touched.password ? formik.errors.password : ""}
								/>
								<MuiTextField
									id="confirmPassword"
									name="confirmPassword"
									label="Confirm Password"
									type="password"
									placeholder="Confirm password"
									isPassword
									value={formik.values.confirmPassword}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={
										formik.touched.confirmPassword &&
										Boolean(formik.errors.confirmPassword)
									}
									helperText={
										formik.touched.confirmPassword
											? formik.errors.confirmPassword
											: ""
									}
								/>
							</div>

							{/* Already have account */}
							<div className="flex items-center justify-end space-x-2">
								<div className="flex items-center gap-1.5">
									<label className="text-sm text-muted-foreground">
										Already have an account?
									</label>
									<span
										onClick={setLogin}
										className="text-[var(--yellow)] hover:text-[var(--yellow-hover)] cursor-pointer"
									>
										Login Now!
									</span>
								</div>
							</div>

							{/* Submit Button */}
							<MuiButton
								type="submit"
								fullWidth
								loading={isLoading || isSendOtpPending || isVerifyOtpPending}
								disabled={isLoading || isSendOtpPending || isVerifyOtpPending}
								
							>
								Create Account
							</MuiButton>

							{/* OR Divider */}
							<div className="text-center my-4 text-muted-foreground text-xs">OR</div>

							{/* Google Auth */}
							<GoogleAuthButton handleGoogleSuccess={handleGoogleAuth} />
						</form>
					</motion.div>
				</div>
			</motion.div>

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
