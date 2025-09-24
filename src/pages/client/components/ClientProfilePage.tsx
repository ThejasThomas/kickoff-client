import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Mail, Phone } from "lucide-react";
import { useToaster } from "@/hooks/ui/useToaster";
import type { IClient } from "@/types/User";
import { getClientProfile } from "@/services/client/clientService";

interface ClientProfileProps {
  initialData?: Partial<IClient>;
}

export const ClientProfile = ({ initialData }: ClientProfileProps) => {
  const { successToast, errorToast } = useToaster();
  const [clientData, setClientData] = useState<Partial<IClient>>(initialData || {});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getClientProfile();
        setClientData(data);
        successToast("Profile loaded successfully!");
      } catch (err) {
        errorToast("Failed to fetch profile");
      }
    };

    if (!initialData) {
      fetchProfile();
    }
  }, [initialData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-teal-100"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
            <p className="text-gray-600 mt-1">View your account details</p>
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
                  value={clientData?.fullName || ""}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 border-gray-300"
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
                  value={clientData?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 border-gray-300"
                  placeholder="No email provided"
                />
                <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={clientData?.phoneNumber || ""}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 border-gray-300"
                  placeholder="No phone number provided"
                />
                <Phone className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};