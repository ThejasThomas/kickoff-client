import { PublicHeader } from "@/components/mainComponents/PublicHeader";
import { useSendOTPMutation } from "@/hooks/auth/useSendOTP";
import { useToaster } from "@/hooks/ui/useToaster";
import { motion } from "framer-motion";
import type { ITurfOwner } from "@/types/User";
import type { UserRoles } from "@/types/UserRoles";
import { turfOwnerSchema } from "@/utils/validations/turfOwner_signup_validation";
import { useFormik } from "formik";
import { useState } from "react";
// import { GoogleAuthButton } from "@/components/auth/GoogleAuth";
import MuiButton from "@/components/common/buttons/MuiButton";
import { LocationInputField } from "@/components/common/fields/LocationInputField";
import { MuiTextField } from "@/components/common/fields/MuiTextField";
import { useVerifyOTPMutation } from "@/hooks/auth/useVerifyOtp";
import OTPModal from "@/components/modals/OTPModal";

interface SignUpProps {
    userType:UserRoles;
    onSubmit:(data:ITurfOwner)=> void;
    setLogin?:()=>void;
    isLoading:boolean;
}

export const TurfOwnerSignUp =({
   onSubmit,
   setLogin,
   isLoading,
}: SignUpProps) => {
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
    const [userData,setUserData] =useState<ITurfOwner>({} as ITurfOwner);
    const [isSending, setIsSending] = useState(false);


    const{mutate:sendVerificationOTP,isPending:isSendOtpPending} = useSendOTPMutation()
    const{mutate:verifyOTP,isPending:isVerifyOtpPending} = useVerifyOTPMutation()

    const {successToast,errorToast}=useToaster()
    const submitRegister =()=>{
        onSubmit(userData);
    }
    
    const handleOpenOTPModal =()=>{
        setIsOTPModalOpen(true)
    }
    const handleCloseOTPModal= ()=>{
        setIsOTPModalOpen(false)
    }

    const handleSendOTP =(email?: string) =>{
        setIsSending(()=>true);
        sendVerificationOTP(email ?? userData.email, {
            onSuccess(data) {
                successToast(data.message)
                setIsSending(false)
                handleOpenOTPModal();
            },
            onError(error:any) {
                errorToast(error.response.data.message)
            }
        })
    }

    const handleVerifyOTP = (otp: string) => {
    verifyOTP(
      { email: userData.email, otp },
      {
        onSuccess() {
          // successToast(data.message);
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

    const formik=useFormik<ITurfOwner & {password:string; confirmPassword:string}>({

        initialValues:{
            turfName:'',
            email:'',
            phoneNumber:'',
            password:'',
            confirmPassword:'',
            geoLocation:{
                type:'Point',
                coordinates:[],
            },
            location: {
                name:'',
                displayName:'',
                zipCode:'',
            },
        },
        validationSchema:turfOwnerSchema,
        onSubmit:(values) =>{
            if(
                values.geoLocation?.coordinates?.length === 0 ||
                !values.location?.zipCode ||
                !values.location?.name ||
                !values.location?.displayName
            ) {
                errorToast('Please select a proper location')
                return;
            }
            setUserData({
                ...values,
                status:'pending',
            });
            handleSendOTP(values.email)
        },
    })

    const handleLocationSelect=(location:{
        name:string;
        zipCode:string,
        displayName:string,
        latitude:number | null;
        longitude:number |null
    }) =>{
         formik.setFieldValue('geoLocation', {
            type:'Point',
            coordinates:[location.longitude,location.latitude],
         });
         formik.setFieldValue('location',{
            name:location.name,
            displayName:location.displayName,
            zipCode:location.zipCode,
         })
    }
    return(
        <>
        <PublicHeader/>
<motion.div className="min-h-screen flex flex-col md:flex-row">
        {/* Left Section with Image */}
        <div className="hidden md:flex w-1/2 bg-[var(--bg-yellow)] relative overflow-hidden justify-center items-end">
          <img
            src={ "/placeholder.svg"}
            alt="barber-tools-bg"
            className="absolute inset-0 w-full h-full object-cover brightness-90"
          />
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            src={''}
            alt="Barber"
            className="relative z-10 w-[40rem] pb"
          />
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto w-full space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Apply for a TurfOwner account
              </h2>
              <p className="text-muted-foreground mt-2">
                Enter your details to get started
              </p>
            </div>

            <form className="space-y-2" onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-3.5">
                {/* Turf Name */}
                <MuiTextField
                  id="turfName"
                  name="turfName"
                  error={
                    formik.touched.turfName && Boolean(formik.errors.turfName)
                  }
                  helperText={
                    formik.touched.turfName ? formik.errors.turfName : ""
                  }
                  value={formik.values.turfName as string}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Turf Name"
                  placeholder="Enter your Turf name"
                />

                {/* Phone */}
                <MuiTextField
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  error={
                    formik.touched.phoneNumber &&
                    Boolean(formik.errors.phoneNumber)
                  }
                  helperText={
                    formik.touched.phoneNumber ? formik.errors.phoneNumber : ""
                  }
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Phone"
                  placeholder="Enter your phone"
                />

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

                {/* Password */}
                <MuiTextField
                  id="password"
                  name="password"
                  type={"password"}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={
                    formik.touched.password ? formik.errors.password : ""
                  }
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Password"
                  isPassword
                  placeholder="Create password"
                />

                {/* Confirm Password */}
                <MuiTextField
                  id="confirmPassword"
                  name="confirmPassword"
                  isPassword={true}
                  type={"password"}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword
                      ? formik.errors.confirmPassword
                      : ""
                  }
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Confirm Password"
                  placeholder="Confirm password"
                />

                {/* Location Field */}
                <div className="space-y-2">
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
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-center justify-end space-x-2">
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground"
                  >
                    Already have an account?{" "}
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
                disabled={isLoading || isSendOtpPending || isVerifyOtpPending}
                loading={isLoading || isSendOtpPending || isVerifyOtpPending}
                fullWidth
              >
                Apply Now!
              </MuiButton>
              {/* Social SignUp */}
              <div className="text-center my-4 text-muted-foreground text-xs">
                OR SIGNIN
              </div>
              {/* <GoogleAuthButton handleGoogleSuccess={handleGoogleAuth} /> */}
            </form>
          </motion.div>
        </div>
</motion.div>
        <OTPModal
        isOpen={isOTPModalOpen}
        onClose={handleCloseOTPModal}
        onVerify={handleVerifyOTP}
        onResend={handleSendOTP}
        isSending={isSending}
      />
        </>
    )
}