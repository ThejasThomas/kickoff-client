
import type { UserRoles } from "@/types/UserRoles"
import { signInSchema } from "@/utils/validations/signin_validator"
import type { CredentialResponse } from "@react-oauth/google"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { GoogleAuthButton } from "./GoogleAuth"
import { Eye, EyeOff, } from "lucide-react"
import { useState } from "react"
import AuthImg from '../../assets/common/kickoff-auth-image.jpg'

interface SignInProps {
  userType: UserRoles
  onSubmit: (data: { email: string; password: string }) => void
  setRegister?: () => void
  isLoading: boolean
  handleGoogleAuth: (credential: CredentialResponse) => void
}

const SignIn = ({ userType, onSubmit, setRegister, isLoading, handleGoogleAuth }: SignInProps) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signInSchema,
    onSubmit: (values) => {
      onSubmit(values)
    },
  })

  const handleForgotPasswordRedirection = () => {
    switch (userType) {
      case "turfOwner":
        navigate("/turfOwner/forgot-password")
        break
      case "admin":
        navigate("/admin/forgot-password")
        break
      default:
        navigate("/forgot-password")
        break
    }
  }

  const backgroundImageSrc =AuthImg

  return (
    <>
      {/* <PublicHeader /> */}
      <div
        className="h-screen flex items-center justify-center p-4 relative overflow-hidden"
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
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-teal-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-white/20"
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-white/80 text-sm">Sign in to KickOff</p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
                <p className="text-red-300 text-xs mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
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

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleForgotPasswordRedirection}
                className="text-teal-300 font-medium hover:text-teal-200 transition-colors underline text-sm"
              >
                Forgot Password?
              </button>
            </div>

            <div className="text-center pt-2">
              {userType !== "admin" && setRegister && (
                <span className="text-white/80 text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={setRegister}
                    className="text-teal-300 font-medium hover:text-teal-200 transition-colors underline"
                  >
                    Create Account!
                  </button>
                </span>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                {/* <span className="px-3 bg-teal-500/20 text-white/80 rounded-full backdrop-blur-sm">OR</span> */}
              </div>
            </div>

            {/* Google Auth */}
            {userType !== "admin" && <GoogleAuthButton handleGoogleSuccess={handleGoogleAuth} />}
          </form>
        </motion.div>
      </div>
    </>
  )
}

export default SignIn