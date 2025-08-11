"use client"

import type { UserRoles } from "@/types/UserRoles"
import { signInSchema } from "@/utils/validations/signin_validator"
import type { CredentialResponse } from "@react-oauth/google"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import MuiTextField from "@mui/material/TextField"
import { motion } from "framer-motion"
import { PublicHeader } from "../mainComponents/PublicHeader"
import { GoogleAuthButton } from "./GoogleAuth"
import { Eye, EyeOff, Lock, Mail, ArrowRight, Play, Trophy, Users, Star } from "lucide-react"
import { useState } from "react"
import SignInImg from "../../assets/common/signIn.png"

interface SignInProps {
  userType: UserRoles
  onSubmit: (data: { email: string; password: string }) => void
  setRegister?: () => void
  isLoading: boolean
  handleGoogleAuth: (credential: CredentialResponse) => void
}

const SignIn = ({
  userType,
  onSubmit,
  setRegister, 
  isLoading, 
  handleGoogleAuth 
}: SignInProps) => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <>
      <PublicHeader />

      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
        {/* Left Section With Image */}
         <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="hidden md:flex md:w-1/2 h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-16 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute top-1/3 right-8 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse delay-700"></div>

      
      <div className="absolute top-20 right-16 w-12 h-12 border-2 border-white/30 rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-32 left-16 w-8 h-8 bg-white/30 rounded-full animate-bounce"></div>
      <div className="absolute top-40 left-20 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce delay-300"></div>
      <div className="absolute bottom-40 right-32 w-10 h-10 border-2 border-pink-300/40 rounded-full animate-pulse delay-600"></div>

      
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

     
      <div className="relative z-10 text-center px-8 max-w-2xl">
      
        <motion.div
          initial={{ scale: 1.2, opacity: 0, rotateY: 15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative mb-12"
        >
         
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-pink-300/20 rounded-3xl blur-2xl transform rotate-6 scale-110"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-yellow-300/20 to-white/20 rounded-3xl blur-xl transform -rotate-3 scale-105"></div>

          
          <div className="relative bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={SignInImg || "/placeholder.svg"}
                alt="Sign In Illustration"
                className="w-full h-auto max-w-md rounded-2xl object-cover shadow-2xl transform hover:scale-105 transition-transform duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
            </div>
          </div>

         
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Play className="w-6 h-6 text-white" />
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Trophy className="w-6 h-6 text-white" />
          </motion.div>

          <motion.div
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/2 -left-6 w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Users className="w-5 h-5 text-white" />
          </motion.div>

          <motion.div
            animate={{ x: [5, -5, 5] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.5 }}
            className="absolute top-1/2 -right-6 w-10 h-10 bg-gradient-to-r from-indigo-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Star  className="w-5 h-5 text-white" />
          </motion.div>
        </motion.div>

      
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-white space-y-6"
        >
          <h2 className="text-5xl font-bold leading-tight">
            Welcome Back to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 animate-pulse">
              KickOff
            </span>
          </h2>
          <p className="text-xl text-white/90 leading-relaxed max-w-lg mx-auto">
            Your ultimate sports booking platform. Connect with players, book venues, and enjoy the game like never
            before!
          </p>

          <div className="flex justify-center space-x-8 mt-8">
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                <Play className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-white/80 font-medium">Easy Booking</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-white/80 font-medium">Find Players</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-white/80 font-medium">Win Rewards</p>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex justify-center mt-12 space-x-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
            className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
            className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
          ></motion.div>
        </div>
      </div>


      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-white/10">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          ></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </motion.div>

        {/* Right Section with Form */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex items-center justify-center p-8 md:p-12"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Get Ready to Play!</h2>
              <p className="text-gray-600">Enter your credentials to continue your journey</p>
            </motion.div>

            {/* Form */}
            <motion.form variants={itemVariants} onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email Address
                </label>
                <div className="relative">
                  <MuiTextField
                    id="email"
                    name="email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email ? formik.errors.email : ""}
                    placeholder="Enter your email address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        "&:hover fieldset": {
                          borderColor: "#3B82F6",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3B82F6",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Password
                </label>
                <div className="relative">
                  <MuiTextField
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password ? formik.errors.password : ""}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        "&:hover fieldset": {
                          borderColor: "#3B82F6",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3B82F6",
                          borderWidth: "2px",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      ),
                    }}
                  />
                </div>
              </motion.div>

              {/* Forgot Password & Register Links */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm"
              >
                <button
                  type="button"
                  onClick={handleForgotPasswordRedirection}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline flex items-center gap-1"
                >
                  Forgot Password?
                </button>
                {userType !== "admin" && (
                  <div className="text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={setRegister}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                    >
                      Register Now!
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>

              {/* Social Sign In */}
              {userType !== "admin" && (
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-50 text-gray-500 font-medium">OR</span>
                    </div>
                  </div>

                  <div className="w-full">
                    <GoogleAuthButton handleGoogleSuccess={handleGoogleAuth} />
                  </div>
                </motion.div>
              )}
            </motion.form>

            {/* Footer Text */}
            <motion.div variants={itemVariants} className="text-center text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default SignIn
