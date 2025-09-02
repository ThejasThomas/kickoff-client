import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { 
  Camera,
  Edit3,
  Save,
  X,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Home
} from 'lucide-react';
import { useToaster } from "@/hooks/ui/useToaster";
import type { ITurfOwner } from "@/types/User";
import * as Yup from "yup";
import { useImageUploader } from "@/hooks/common/ImageUploader";
import { turfOwnerSchema } from "@/utils/validations/turfOwner_signup_validation";
import { getTurfOwnerProfile, updateTurfOwnerProfile } from "@/services/TurfOwner/turfOwnerService";

interface TurfOwnerProfileProps {
  initialData?: Partial<ITurfOwner>;
  onSave: (data: ITurfOwner) => void;
  isLoading?: boolean;
}

interface ProfileFormData extends ITurfOwner {
  profileImage?: string | File;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
}

export const OwnerProfile = ({ 
  initialData, 
  onSave, 
  isLoading = false 
}: TurfOwnerProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { successToast, errorToast } = useToaster();
  const { images, handleImageUpload, removeImage } = useImageUploader("turfOwners", 1);

  const [profileData, setProfileData] = useState<Partial<ITurfOwner>>(initialData || {});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getTurfOwnerProfile();
        setProfileData(data);
      } catch (err) {
        errorToast("Failed to fetch profile");
      }
    };

    if (!initialData) {
      fetchProfile();
    }
  }, [initialData]);

  const profileImagePreview = images[0]?.cloudinaryUrl || 
    (profileData?.profileImage && typeof profileData.profileImage === 'string' ? profileData.profileImage : null);

  const profileSchema = turfOwnerSchema.concat(Yup.object({
    address: Yup.string()
      .trim()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must not exceed 200 characters")
      .required("Address is required"),
    city: Yup.string()
      .trim()
      .min(2, "City must be at least 2 characters")
      .max(50, "City must not exceed 50 characters")
      .required("City is required"),
    state: Yup.string()
      .trim()
      .min(2, "State must be at least 2 characters")
      .max(50, "State must not exceed 50 characters")
      .required("State is required"),
    pinCode: Yup.string()
      .trim()
      .matches(/^[0-9]{6}$/, "Pin code must be exactly 6 digits")
      .required("Pin code is required"),
  }));

  const formik = useFormik<ProfileFormData>({
    initialValues: {
      _id: profileData?._id || "",
      userId: profileData?.userId || "",
      ownerName: profileData?.ownerName || "",
      email: profileData?.email || "",
      phoneNumber: profileData?.phoneNumber || "",
      address: profileData?.address || "",
      city: profileData?.city || "",
      state: profileData?.state || "",
      pinCode: profileData?.pinCode || "",
      status: profileData?.status || "pending",
      profileImage: profileData?.profileImage || undefined,
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        let finalImage = profileImagePreview;

        if (images[0]?.cloudinaryUrl) {
          finalImage = images[0].cloudinaryUrl;
        }

        const ownerData: ITurfOwner = {
          ...values,
          profileImage: finalImage || undefined,
        };
        const updatedOwner = await updateTurfOwnerProfile(ownerData)

        onSave(updatedOwner);
        setIsEditing(false);
        successToast("Profile updated successfully!");
      } catch (err) {
        errorToast("Failed to update profile");
      }
    },
  });

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files);
      formik.setFieldValue("profileImage", e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-teal-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
              <p className="text-gray-600 mt-1">Add your turf details to get started</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isEditing 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-500" />
              Profile Photo
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {profileImagePreview ? (
                    <img 
                      src={profileImagePreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={triggerFileInput}
                    className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-teal-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
              
              {isEditing && profileImagePreview && (
                <button
                  type="button"
                  onClick={() => removeImage(images[0]?.id || 0)}
                  className="text-red-600 text-sm hover:text-red-700 font-medium"
                >
                  Remove photo
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.div>

          {/* Basic Info */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-500" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="ownerName"
                    value={formik.values.ownerName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      isEditing ? 'bg-white' : 'bg-gray-100'
                    } ${formik.touched.ownerName && formik.errors.ownerName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter owner name"
                  />
                  <User className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                {formik.touched.ownerName && formik.errors.ownerName && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.ownerName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      isEditing ? 'bg-white' : 'bg-gray-100'
                    } ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter email"
                  />
                  <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      isEditing ? 'bg-white' : 'bg-gray-100'
                    } ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter phone number"
                  />
                  <Phone className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Address Info */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-500" />
              Address Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      isEditing ? 'bg-white' : 'bg-gray-100'
                    } ${formik.touched.address && formik.errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter address"
                  />
                  <Home className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                {formik.touched.address && formik.errors.address && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.address}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100'
                  } ${formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter city"
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100'
                  } ${formik.touched.state && formik.errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter state"
                />
                {formik.touched.state && formik.errors.state && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.state}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pin Code
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={formik.values.pinCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100'
                  } ${formik.touched.pinCode && formik.errors.pinCode ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter pin code"
                />
                {formik.touched.pinCode && formik.errors.pinCode && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.pinCode}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          {isEditing && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex justify-end gap-4"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsEditing(false);
                  formik.resetForm();
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={isLoading || !formik.isValid}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-green-600 text-white rounded-lg hover:from-teal-600 hover:to-green-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Profile
              </motion.button>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};