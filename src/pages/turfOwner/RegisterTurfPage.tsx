import AddTurfModal from "@/components/ReusableComponents/AddTurfComponent";
import type { Turf } from "@/types/Turf";
import { MapPin, Phone, Plus, Star } from "lucide-react";
import  { useState } from "react";
import { useAddTurfMutation } from "@/hooks/turfOwner/addTurf";
import type { ITurfResponse } from "@/types/Response";

const RegisterTurfPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {mutate:addTurf,isPending}=useAddTurfMutation()

   const handleSubmit = async (turfData: Turf) => {
    console.log("Submitting turf data:", turfData);
    
    addTurf(turfData, {
      onSuccess: (response:ITurfResponse) => {
        console.log("Turf added successfully:", response);
        if (response.success) {
          alert("Turf registered successfully!");
          setIsModalOpen(false);
        } else {
          alert(response.message || "Failed to register turf. Please try again.");
        }
      },
      onError: (error: any) => {
        console.error("Error submitting turf:", error);
        
        if (error.response?.status === 400) {
          alert("Invalid data provided. Please check your inputs.");
        } else if (error.response?.status === 401) {
          alert("Please login to continue.");
        } else if (error.response?.status === 500) {
          alert("Server error. Please try again later.");
        } else {
          alert("Failed to register turf. Please check your connection and try again.");
        }
      }
    });
  };
 return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Register Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              {" "}
              Turf
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join thousands of turf owners who trust us to connect them with
            passionate players. Showcase your facility and boost your bookings
            today.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isPending}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus
              className="mr-3 group-hover:rotate-90 transition-transform duration-300"
              size={24}
            />
            {isPending ? "Processing..." : "Add Your Turf"}
            <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide everything you need to manage and grow your turf business
            efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Star className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Increased Visibility
            </h3>
            <p className="text-gray-600">
              Reach thousands of potential customers searching for turfs in your
              area. Get discovered by players looking for their next game.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Phone className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Easy Management
            </h3>
            <p className="text-gray-600">
              Simple booking management system with automated confirmations and
              customer communication tools.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Location-Based
            </h3>
            <p className="text-gray-600">
              Smart location matching connects you with nearby players. Maximize
              your bookings with targeted local reach.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join our community of successful turf owners and start growing your
            business today
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isPending}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="mr-3" size={24} />
            {isPending ? "Processing..." : "Register Your Turf Now"}
          </button>
        </div>
      </div>

      <AddTurfModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RegisterTurfPage;
