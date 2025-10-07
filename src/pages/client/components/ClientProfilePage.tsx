import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Mail, Phone, X, Save, Edit } from "lucide-react";
import { useToaster } from "@/hooks/ui/useToaster";
import type { IClient, IUpdateClient } from "@/types/User";
import { getClientProfile, updateClientProfile } from "@/services/client/clientService";

interface ClientProfileProps {
  initialData?: Partial<IClient>;
}

export const ClientProfile = ({ initialData }: ClientProfileProps) => {
  const { successToast, errorToast } = useToaster();
  const [clientData, setClientData] = useState<Partial<IUpdateClient>>(initialData || {});
  const [originalData, setOriginalData] = useState<Partial<IUpdateClient>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('page mountedd')
    const fetchProfile = async () => {
      try {
        const data = await getClientProfile();
        console.log('api called')
        // Assuming data has the required fields, cast to IUpdateClient
        const updateData: IUpdateClient = {
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        };
        setClientData(updateData);
        setOriginalData(updateData);
        successToast("Profile loaded successfully!");
      } catch (err) {
        errorToast("Failed to fetch profile");
        console.log(err)
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setOriginalData({ ...clientData } as Partial<IUpdateClient>);
    setIsEditing(true)
  }

  const handleCancel = () => {
    setClientData({ ...originalData });
    setIsEditing(false);
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!clientData.fullName || !clientData.email || !clientData.phoneNumber) {
        throw new Error("All fields are required");
      }
      const payload: IUpdateClient = clientData as IUpdateClient;
      await updateClientProfile(payload)
      setOriginalData({ ...payload });
      setIsEditing(false)
      successToast("Profile updated Successfully");
    } catch (err) {
      errorToast("Failed to update profile")
      console.log(err);
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof IUpdateClient, value: string) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-teal-100"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
              <p className="text-gray-600 mt-1">View and edit your account details</p>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            ) : null}
          </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={clientData.fullName || ""}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500' 
                      : 'bg-gray-100 border-gray-300'
                  }`}
                  placeholder="No name provided"
                />
                <User className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={clientData.email || ""}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500' 
                      : 'bg-gray-100 border-gray-300'
                  }`}
                  placeholder="No email provided"
                />
                <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={clientData.phoneNumber || ""}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500' 
                      : 'bg-gray-100 border-gray-300'
                  }`}
                  placeholder="No phone number provided"
                />
                <Phone className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};