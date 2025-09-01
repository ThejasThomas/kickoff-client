"use client";
import {motion} from 'framer-motion'
import { GenericTable } from "@/components/ReusableComponents/GenericTable";
import RejectionModal from "@/components/ReusableComponents/RejectionModal";
import { adminService } from "@/services/admin/adminService";
import type { ApiResponse, FetchParams } from "@/types/api.type";
import type {
  // ExtendableItem,
  TableAction,
  TableColumn,
} from "@/types/table_type";
import type { ITurf } from "@/types/Turf";
import { AnimatePresence } from "framer-motion";
import { Check, MapPin, X, ImageIcon, XIcon, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// interface Turf extends ExtendableItem {
//   _id: string;
//   turfName: string;
//   location: string;
//   courtType: string;
//   status: string;
//   createdAt: string;
//   pricePerHour: string;
//   amenities: string[];
//   images: string[];
// }

console.log("heloo bro");

const AmenitiesModal = ({ 
  isOpen, 
  onClose, 
  amenities, 
  turfName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  amenities: string[]; 
  turfName: string;
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {turfName} - Amenities
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
            >
              <XIcon size={20} />
            </button>
          </div>
          
          {amenities.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="bg-gray-800 px-3 py-2 rounded-lg text-sm text-gray-300 border border-gray-700"
                >
                  {amenity}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              No amenities available
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
const ImagesModal = ({ 
  isOpen, 
  onClose, 
  images, 
  turfName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  images: string[]; 
  turfName: string;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {turfName} - Images ({images.length})
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
            >
              <XIcon size={20} />
            </button>
          </div>
          
          {images.length > 0 ? (
            <>
              {/* Main Image Display */}
              <div className="relative mb-4">
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${turfName} image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                
                {/* Image counter */}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnail navigation */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex 
                          ? 'border-blue-500' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No images available
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};



type turfStatus = "approved" | "rejected" | "pending";

export default function TurfVerification() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTurfId, setSelectedTurfId] = useState<string | null>(null);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);
const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedTurfName, setSelectedTurfName] = useState<string>("");
  const turfRejectionReasons = [
    "Incomplete turf details",
    "Invalid location/address",
    "Suspicious or fraudulent listing",
  ];
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const fetchTurfs = async (
    params: FetchParams
  ): Promise<ApiResponse<ITurf>> => {
    try {
      const response = await adminService.getAllTurfs({
        page: params.page,
        limit: params.limit,
        search: params.search,
        status:"pending"
      });

      const turfs: ITurf[] = response.turfs.map((turf: any) => ({
        _id: turf._id,
        turfName: turf.turfName || "Unknown Turf",
        description: turf.description || "",
        location: {
          address: turf.location?.address || "Not Provided",
          city: turf.location?.city || "Not Provided",
          state: turf.location?.state || "",
          coordinates: turf.location?.coordinates || {
            type: "Point",
            coordinates: [0, 0],
          },
        },
        courtType: turf.courtType || "Not specified",
        status: turf.status,
        createdAt: turf.createdAt ? new Date(turf.createdAt) : new Date(),
        pricePerHour: turf.pricePerHour || "Not Provided",
        amenities: turf.amenities || [],
        images: turf.images || [],
        contactNumber: turf.contactNumber || "N/A",
      }));

      return {
        success: response.success,
        users: turfs,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        message: response.message,
      };
    } catch (error) {
      console.error("Failed to fetch turfs", error);
      return {
        success: false,
        users: [],
        totalPages: 0,
        currentPage: 1,
        message: "Failed to fetch turfs",
      };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-900/30 text-green-400 border border-green-500/30";
      case "rejected":
        return "bg-red-900/30 text-red-400 border border-red-500/30";
      case "pending":
        return "bg-gray-900/30 text-gray-400 border border-gray-500/30";
    }
  };

  const handleStatusChange = async (turfId: string, newStatus: turfStatus) => {
    try {
      const res = await adminService.updateEntityStatus(
        "turf",
        turfId,
        newStatus
      );

      if (res.success) {
        toast.success(`Turf status updated to ${newStatus}`);
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error(`Failed to update turf status: ${res.message}`);
      }
    } catch (error) {
      console.error("Error while updating turf status:", error);
      toast.error("Error updating turf status. Please try again later");
    }
  };

  const handleRejectClick = (turfId: string) => {
    setSelectedTurfId(turfId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!selectedTurfId) return;

    try {
      setIsSubmittingReject(true);
      const res = await adminService.updateEntityStatus(
        "turf",
        selectedTurfId,
        "rejected",
        reason
      );

      if (res.success) {
        toast.success("Turf rejected successfully");
        setShowRejectModal(false);
        setSelectedTurfId(null);
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error(`Failed to reject turf: ${res.message}`);
      }
    } catch (error) {
      console.error("Error while rejecting turf:", error);
      toast.error("Error rejecting turf. Please try again later");
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedTurfId(null);
  };
  const handleViewAmenities = (amenities: string[], turfName: string) => {
    setSelectedAmenities(amenities);
    setSelectedTurfName(turfName);
    setShowAmenitiesModal(true);
  };

  const closeAmenitiesModal = () => {
    setShowAmenitiesModal(false);
    setSelectedAmenities([]);
    setSelectedTurfName("");
  };

   const handleViewImages = (images: string[], turfName: string) => {
    setSelectedImages(images);
    setSelectedTurfName(turfName);
    setShowImagesModal(true);
  };

  const closeImagesModal = () => {
    setShowImagesModal(false);
    setSelectedImages([]);
    setSelectedTurfName("");
  };

   const columns: TableColumn<ITurf>[] = [
    {
      key: "turfName",
      label: "Turf Name",
      width: "col-span-3", 
      render: (turf) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
            <MapPin className="text-gray-400" size={16} />
          </div>
          <span className="font-medium truncate text-sm">{turf.turfName}</span>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      width: "col-span-2", // 2
      render: (turf) => <span className="text-sm text-gray-300 truncate whitespace-nowrap">{turf.location.city}</span>,
    },
    {
      key: "courtType",
      label: "Court Type",
      width: "col-span-1", // 1
      render: (turf) => <span className="text-sm text-gray-400 whitespace-nowrap">{turf.courtType}</span>,
    },
    {
      key: "pricePerHour",
      label: "Price / Hour",
      width: "col-span-1", // 1
      render: (turf) => <span className="text-sm text-gray-400 whitespace-nowrap">₹{turf.pricePerHour}</span>,
    },
    {
      key: "amenities",
      label: "Amenities",
      width: "col-span-2",
      render: (turf) => (
        <div className="flex items-center gap-2">
          {turf.amenities.length > 0 ? (
            <>
              {/* <span className="text-xs text-gray-400">
                {turf.amenities.length} amenities
              </span> */}
              <button
                onClick={() => handleViewAmenities(turf.amenities, turf.turfName)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 transition-colors"
              >
                <Eye size={12} />
                View
              </button>
            </>
          ) : (
            <span className="text-xs text-gray-500">No amenities</span>
          )}
        </div>
      ),
    },
    {
      key: "images",
      label: "Images",
      width: "col-span-1",
      render: (turf) => (
        <div className="flex items-center gap-2">
          {turf.images.length > 0 ? (
            <button
              onClick={() => handleViewImages(turf.images, turf.turfName)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 transition-colors"
            >
              <ImageIcon size={12} />
              View Images
            </button>
          ) : (
            <span className="text-xs text-gray-500">No images</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "col-span-1", // 1
      render: (turf) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(turf.status)}`}>
          {turf.status}
        </span>
      ),
    },
  ]

  const actions: TableAction<ITurf>[] = [
    {
      label: "Approve",
      icon: <Check size={12} />,
      onClick: (turf) =>{ if(!turf._id) return;
         handleStatusChange(turf._id, "approved")},
      condition: (turf) => turf.status !== "approved",
      variant: "success",
      refreshAfter: true,
    },
    {
      label: "Reject",
      icon: <X size={12} />,
      onClick: (turf) =>{ if(!turf._id) return;
         handleRejectClick(turf._id)},
      condition: (turf) => turf.status !== "rejected",
      variant: "danger",
      refreshAfter: true,
    },
  ];

  return (
    <>
      <GenericTable<ITurf>
        key={refreshKey}
        title="Turf Verification"
        columns={columns}
        actions={actions}
        fetchData={fetchTurfs}
        searchPlaceholder="Search turfs.."
        itemsPerPage={5}
        enableSearch
        enablePagination
        enableActions
        emptyMessage="No turfs found matching your criteria"
        loadingMessage="Loading turfs list..."
      />

      <RejectionModal
        isOpen={showRejectModal}
        onClose={closeRejectModal}
        onSubmit={handleRejectSubmit}
        title="Reject Turf"
        description="Please select a reason for rejecting this turf"
        predefinedReasons={turfRejectionReasons}
        isSubmitting={isSubmittingReject}
      />
      <AmenitiesModal
        isOpen={showAmenitiesModal}
        onClose={closeAmenitiesModal}
        amenities={selectedAmenities}
        turfName={selectedTurfName}
      />
      <ImagesModal
        isOpen={showImagesModal}
        onClose={closeImagesModal}
        images={selectedImages}
        turfName={selectedTurfName}
      />
    </>
  );
}
