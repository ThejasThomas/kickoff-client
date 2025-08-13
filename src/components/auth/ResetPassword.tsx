import { useToaster } from "@/hooks/ui/useToaster";
import { useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { PublicHeader } from "../mainComponents/PublicHeader";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import { passwordSchema } from "@/utils/validations/password_validator";
import { useResetPasswordMutation } from "@/hooks/auth/useResetPassword";
import { useFormik } from "formik";
import BackgroundImg from '../.././assets/common/kickoff-auth-image.jpg'

interface ResetPasswordProps {
  role: string
  signInPath: string
}

const ResetPassword = ({ role, signInPath }: ResetPasswordProps) => {
  const { token } = useParams<{ token: string }>()
  const [passwordReset, setPasswordReset] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()
  const { successToast, errorToast } = useToaster()
  const { mutate: resetPasswordReq, isPending } = useResetPasswordMutation()

  const handleResetPasswordSubmit = (password: string) => {
    resetPasswordReq(
      { password, role, token },
      {
        onSuccess: (data) => {
          successToast(data.message)
          setPasswordReset(true)
        },
        onError: (error: any) => {
          errorToast(error.response.data.message)
        },
      },
    )
  }

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      handleResetPasswordSubmit(values.password)
    },
  })

  const backgroundImageSrc = BackgroundImg

  return (
    <>
      <PublicHeader />
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
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              animate={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
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
            background: "linear-gradient(135deg, rgba(20, 184, 166, 0.25) 0%, rgba(5, 150, 105, 0.25) 100%)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate(signInPath)}
            className="flex items-center text-white/80 hover:text-white transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Sign In
          </motion.button>

          {passwordReset ? (
            // Success State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-white/20"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Password Reset Complete</h2>
                <p className="text-white/80 text-sm">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
              </div>
              <motion.button
                onClick={() => navigate(signInPath)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
              >
                Go to Sign In
              </motion.button>
            </motion.div>
          ) : (
            // Form State
            <>
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-r from-teal-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-white/20"
                >
                  <Lock className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Reset Your Password</h2>
                <p className="text-white/80 text-sm">Please enter your new password below</p>
              </div>

              <form className="space-y-4" onSubmit={formik.handleSubmit}>
                {/* Password Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your new password"
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-300 text-xs mt-1">{formik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your new password"
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
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-300 text-xs mt-1">{formik.errors.confirmPassword}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </>
  )
}

export default ResetPassword

