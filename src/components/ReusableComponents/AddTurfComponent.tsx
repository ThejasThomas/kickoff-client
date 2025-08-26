import React, { useState } from "react";
import { X, MapPin, Phone, Upload, Trash2, Plus } from "lucide-react";
import { useFormik } from "formik";
import { turfSchema } from "@/utils/validations/turf_register_validation";
import * as Yup from "yup";
import type { LocationCoordinates, Turf } from "@/types/Turf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/hooks/common/form-field";
import TurfLocationPicker from "../turfOwner/TurfDetails/map-location-picker";

interface ImageType {
  file?: File;
  preview: string;
  id: number;
}

interface AddTurfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Turf) => void;
}

const AddTurfModal: React.FC<AddTurfModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [coordinates, setCoordinates] = useState<LocationCoordinates>({
    lat: 12.9716,
    lng: 77.5946,
  });
  const [images, setImages] = useState<ImageType[]>([]);
  const [availableOptions, setAvailableOptions] = useState({
    amenities: [
      "Parking",
      "Restrooms",
      "Changing Rooms",
      "Drinking Water",
      "First Aid",
      "Cafeteria",
      "WiFi",
      "Security",
    ],
    courtTypes: ["5x5", "6x6", "7x7", "11x11"],
  });

  const [customInputs, setCustomInputs] = useState({
    newAmenity: "",
    newCourtType: "",
  });

  const formik = useFormik({
    initialValues: {
      // ownerId: "",
      turfName: "",
      description: "",
      address: "",
      city: "",
      state: "",
      contactNumber: "",
      longitude: coordinates.lng.toString(),
      latitude: coordinates.lat.toString(),
      amenities: [] as string[],
      pricePerHour: "",
      courtType: "",
      status: "active",
    },
    validationSchema: turfSchema,
    onSubmit: (values) => {
      if (images.length === 0) {
        alert("Please upload at least one image");
        return;
      }

      const turfData: Turf = {
        // ownerId: values.ownerId,
        turfName: values.turfName,
        description: values.description,
        location: {
          address: values.address,
          city: values.city,
          state: values.state,
          coordinates: {
            type: "Point",
            coordinates: [
              parseFloat(values.longitude),
              parseFloat(values.latitude),
            ],
          },
        },
        amenities: values.amenities,
        images: images.map((img) => img.preview),
        contactNumber: values.contactNumber,
        pricePerHour: values.pricePerHour,
        courtType: values.courtType,
        status: values.status as "active" | "inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Submitting turf data with coordinates:", {
        lat: parseFloat(values.latitude),
        lng: parseFloat(values.longitude),
        coordinates: turfData.location.coordinates
      });

      onSubmit(turfData);
      handleClose();
    },
  });

// console.log("Form validation status:", {
//   isValid: formik.isValid,
//   errors: formik.errors,
//   touched: formik.touched,
//   imagesCount: images.length
// });
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (images.length + files.length <= 10) {
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Date.now() + Math.random(),
      }));

      setImages((prev) => [...prev, ...newImages]);
    } else {
      alert("Maximum 10 images allowed");
    }
  };

  const removeImage = (imageId: number) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const addNewAmenity = () => {
    const newAmenity = customInputs.newAmenity.trim();
    if (newAmenity && !availableOptions.amenities.includes(newAmenity)) {
      setAvailableOptions((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity],
      }));
      setCustomInputs((prev) => ({ ...prev, newAmenity: "" }));
    }
  };

  const addNewCourtType = () => {
    const newCourtType = customInputs.newCourtType.trim();
    if (newCourtType && !availableOptions.courtTypes.includes(newCourtType)) {   
      setAvailableOptions((prev) => ({
        ...prev,
        courtTypes: [...prev.courtTypes, newCourtType],
      }));
      setCustomInputs((prev) => ({ ...prev, newCourtType: "" }));
    }
  };

  const handleCustomInputChange = (
    field: keyof typeof customInputs,
    value: string
  ) => {
    setCustomInputs((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = formik.values.amenities;
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity];

    formik.setFieldValue("amenities", newAmenities);
  };

  const handleLocationChange = (coords: LocationCoordinates) => {
    console.log("Location changed:", coords);
    setCoordinates(coords);
    formik.setFieldValue("longitude", coords.lng.toString());
    formik.setFieldValue("latitude", coords.lat.toString());
  };

  const handleAddressChange = (addressData: { address: string; city: string; state: string }) => {
    console.log("Address data from map:", addressData);
    
    if (addressData.address) {
      formik.setFieldValue("address", addressData.address);
    }
    if (addressData.city) {
      formik.setFieldValue("city", addressData.city);
    }
    if (addressData.state) {
      formik.setFieldValue("state", addressData.state);
    }
  };

  const handleClose = () => {
    formik.resetForm();
    setImages([]);
    setCustomInputs({
      newAmenity: "",
      newCourtType: "",
    });
    setCoordinates({ lat: 12.9716, lng: 77.5946 });
    onClose();
  };

  const getFieldError = (fieldName: keyof typeof formik.values) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Add Your Turf</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Turf Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Turf Name *
              </label>
              <input
                type="text"
                name="turfName"
                value={formik.values.turfName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter turf name"
              />
              {getFieldError("turfName") && (
                <p className="text-red-500 text-sm mt-1">
                  {getFieldError("turfName")}
                </p>
              )}
            </div>

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Images (At least 1 required) *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={48} />
                  <p className="text-gray-600">Click to upload images</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload up to 10 images
                  </p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {images.map((img, index) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length === 0 && (
                <p className="text-red-500 text-sm mt-1">
                  At least one image is required
                </p>
              )}
            </div>

            {/* Location Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl text-gray-800">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Address Fields */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter complete address"
                      rows={3}
                    />
                    {getFieldError("address") && (
                      <p className="text-red-500 text-sm mt-1">
                        {getFieldError("address")}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="City name"
                      />
                      {getFieldError("city") && (
                        <p className="text-red-500 text-sm mt-1">
                          {getFieldError("city")}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="State name"
                      />
                      {getFieldError("state") && (
                        <p className="text-red-500 text-sm mt-1">
                          {getFieldError("state")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Map Component */}
                <div className="mt-6">
                  <TurfLocationPicker
                    coordinates={coordinates}
                    onLocationChange={handleLocationChange}
                    onAddressChange={handleAddressChange}
                    showCard={false}
                    title="Select Your Turf Location"
                  />
                </div>

                {/* Hidden coordinates display for debugging */}
                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                  Current Coordinates: Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
                </div>
              </CardContent>
            </Card>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number *
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="tel"
                  name="contactNumber"
                  value={formik.values.contactNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="9876543210"
                />
              </div>
              {getFieldError("contactNumber") && (
                <p className="text-red-500 text-sm mt-1">
                  {getFieldError("contactNumber")}
                </p>
              )}
            </div>

            {/* Price and Court Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price per Hour *
                </label>
                <input
                  type="text"
                  name="pricePerHour"
                  value={formik.values.pricePerHour}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="500"
                />
                {getFieldError("pricePerHour") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getFieldError("pricePerHour")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Court Type *
                </label>
                <select
                  name="courtType"
                  value={formik.values.courtType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select court type</option>
                  {availableOptions.courtTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {getFieldError("courtType") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getFieldError("courtType")}
                  </p>
                )}
              </div>
            </div>

            {/* Add New Court Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add Custom Court Type
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInputs.newCourtType}
                  onChange={(e) =>
                    handleCustomInputChange("newCourtType", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add new court type (e.g., 8x8)"
                  onKeyPress={(e) => e.key === "Enter" && addNewCourtType()}
                />
                <button
                  type="button"
                  onClick={addNewCourtType}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe your turf, facilities, and what makes it special..."
                rows={4}
              />
              {getFieldError("description") && (
                <p className="text-red-500 text-sm mt-1">
                  {getFieldError("description")}
                </p>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amenities (At least 1 required) *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {availableOptions.amenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-3 rounded-lg border-2 transition-colors text-left ${
                      formik.values.amenities.includes(amenity)
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>

              {/* Add New Amenity */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInputs.newAmenity}
                  onChange={(e) =>
                    handleCustomInputChange("newAmenity", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add new amenity"
                  onKeyPress={(e) => e.key === "Enter" && addNewAmenity()}
                />
                <button
                  type="button"
                  onClick={addNewAmenity}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {getFieldError("amenities") && (
                <p className="text-red-500 text-sm mt-1">
                  {getFieldError("amenities")}
                </p>
              )}

              {formik.values.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formik.values.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={
                   !formik.isValid || images.length === 0
                }
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {formik.isSubmitting
                  ? "Submitting..."
                  : "Submit Turf Registration"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTurfModal;