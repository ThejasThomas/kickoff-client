import type React from "react";
import { useState, useRef } from "react";
import { MapPin, Phone, Trash2, Plus, ArrowLeft } from "lucide-react";
import { useFormik } from "formik";
import { turfSchema } from "@/utils/validations/turf_register_validation";
import type { LocationCoordinates, NewTurf } from "@/types/Turf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TurfLocationPicker from "../turfOwner/TurfDetails/map-location-picker";
import { useImageUploader } from "@/hooks/common/ImageUploader";

interface ImageType {
  file?: File;
  preview: string;
  id: number;
  cloudinaryUrl?: string;
  isUploading?: boolean;
}

interface AddTurfPageProps {
  onSubmit: (data: NewTurf) => void;
  onCancel?: () => void;
}

const AddTurfPage: React.FC<AddTurfPageProps> = ({ onSubmit, onCancel }) => {
  const [coordinates, setCoordinates] = useState<LocationCoordinates>({
    lat: 12.9716,
    lng: 77.5946,
  });
  const MAX_IMAGES = 10;
  const addInputRef = useRef<HTMLInputElement | null>(null);
  const { images, handleImageUpload, removeImage, setImages } =
    useImageUploader("turf-images", MAX_IMAGES);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
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

  type FormStatus = "active" | "inactive";

  const formik = useFormik({
    initialValues: {
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
      status: "active" as FormStatus,
    },
    validationSchema: turfSchema,
    onSubmit: async (values) => {
      if (images.length === 0) {
        alert("Please upload at least one image");
        return;
      }
      const uploadedImages = images.filter((img) => img.cloudinaryUrl);
      if (uploadedImages.length !== images.length) {
        alert("Please wait for all images to finish uploading");
        return;
      }

      const turfData: NewTurf = {
        turfName: values.turfName,
        description: values.description,
        location: {
          address: values.address,
          city: values.city,
          state: values.state,
          coordinates: {
            type: "Point",
            coordinates: [
              Number.parseFloat(values.longitude),
              Number.parseFloat(values.latitude),
            ],
          },
        },
        amenities: values.amenities,
        images: uploadedImages.map((img) => img.cloudinaryUrl!),
        contactNumber: values.contactNumber,
        pricePerHour: Number.parseFloat(values.pricePerHour),
        courtType: values.courtType,
        status: values.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onSubmit(turfData);
    },
  });

  const getFieldError = (fieldName: keyof typeof formik.values) =>
    formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : null;

  const handleCustomInputChange = (
    field: keyof typeof customInputs,
    value: string
  ) => setCustomInputs((prev) => ({ ...prev, [field]: value }));

  const addNewAmenity = () => {
    const v = customInputs.newAmenity.trim();
    if (v && !availableOptions.amenities.includes(v)) {
      setAvailableOptions((p) => ({ ...p, amenities: [...p.amenities, v] }));
      setCustomInputs((p) => ({ ...p, newAmenity: "" }));
    }
  };

  const addNewCourtType = () => {
    const v = customInputs.newCourtType.trim();
    if (v && !availableOptions.courtTypes.includes(v)) {
      setAvailableOptions((p) => ({ ...p, courtTypes: [...p.courtTypes, v] }));
      setCustomInputs((p) => ({ ...p, newCourtType: "" }));
    }
  };

  const toggleAmenity = (amenity: string) => {
    const current = formik.values.amenities;
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    formik.setFieldValue("amenities", next);
  };

  const handleLocationChange = (coords: LocationCoordinates) => {
    setCoordinates(coords);
    formik.setFieldValue("longitude", coords.lng.toString());
    formik.setFieldValue("latitude", coords.lat.toString());
  };

  const handleAddressChange = (addressData: {
    address: string;
    city: string;
    state: string;
  }) => {
    if (addressData.address)
      formik.setFieldValue("address", addressData.address);
    if (addressData.city) formik.setFieldValue("city", addressData.city);
    if (addressData.state) formik.setFieldValue("state", addressData.state);
  };

  const handleCancel = () => {
    images.forEach((img) => {
      if (img.preview) URL.revokeObjectURL(img.preview);
    });
    formik.resetForm();
    setImages([]);
    setCustomInputs({ newAmenity: "", newCourtType: "" });
    setCoordinates({ lat: 12.9716, lng: 77.5946 });
    if (onCancel) onCancel();
    else if (typeof window !== "undefined") window.history.back();
  };

  const canSubmit = () => {
    const hasValidImages =
      images.length > 0 &&
      images.every((img) => img.cloudinaryUrl && !img.isUploading);
    return formik.isValid && hasValidImages && !isUploadingImages;
  };

  // Color system: green (primary), blue (accent), neutrals (white, gray)
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-2 hover:bg-white/20 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="ml-2 text-xl font-semibold">Add Your Turf</h1>
        </div>
      </header>

      <div className="bg-blue-50/70 border-y border-blue-100">
        <div className="mx-auto max-w-5xl px-4 py-3 flex flex-wrap gap-2">
          <a
            href="#details"
            className="text-blue-700 text-sm px-3 py-1 rounded-full bg-white border border-blue-200 hover:bg-blue-50"
          >
            Details
          </a>
          <a
            href="#images"
            className="text-blue-700 text-sm px-3 py-1 rounded-full bg-white border border-blue-200 hover:bg-blue-50"
          >
            Images
          </a>
          <a
            href="#location"
            className="text-blue-700 text-sm px-3 py-1 rounded-full bg-white border border-blue-200 hover:bg-blue-50"
          >
            Location
          </a>
          <a
            href="#contact"
            className="text-blue-700 text-sm px-3 py-1 rounded-full bg-white border border-blue-200 hover:bg-blue-50"
          >
            Contact
          </a>
          <a
            href="#pricing"
            className="text-blue-700 text-sm px-3 py-1 rounded-full bg-white border border-blue-200 hover:bg-blue-50"
          >
            Pricing & Court
          </a>
          <a
            href="#amenities"
            className="text-blue-700 text-sm px-3 py-1 rounded-full bg-white border border-blue-200 hover:bg-blue-50"
          >
            Amenities
          </a>
          <a
            href="#status"
            className="text-blue-700 text-sm px-3 py-1 rounded-full bg-white border border-blue-200 hover:bg-blue-50"
          >
            Status
          </a>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Turf Name */}
          <div
            id="details"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-green-600"
          >
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
          <div
            id="images"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-blue-500"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Add Images
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: MAX_IMAGES }).map((_, idx) => {
                const img = images[idx] as ImageType | undefined;
                const isAddSlot =
                  idx === images.length && images.length < MAX_IMAGES;
                const isPlaceholder =
                  idx > images.length || images.length === MAX_IMAGES;

                // Filled slot with image
                if (img) {
                  return (
                    <div
                      key={`img-${img.id}`}
                      className="relative group h-36 rounded-xl overflow-hidden border border-gray-200"
                    >
                      <img
                        src={
                          img.preview ||
                          "/placeholder.svg?height=144&width=192&query=uploaded image preview"
                        }
                        alt="Uploaded image preview"
                        className={`w-full h-full object-cover ${
                          img.isUploading ? "opacity-50" : ""
                        }`}
                      />
                      {img.isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60"
                        disabled={!!img.isUploading}
                        aria-label="Remove image"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                }

                // Next available slot with + add button
                if (isAddSlot) {
                  return (
                    <div
                      key={`add-${idx}`}
                      className="h-36 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
                    >
                      {/* single-file input for this add slot */}
                      <input
                        ref={addInputRef}
                        id="image-upload-next"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleImageUpload(e.target.files); // hook already handles FileList
                            // allow selecting the same file again later
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <label
                        htmlFor="image-upload-next"
                        className="cursor-pointer flex flex-col items-center justify-center text-gray-600"
                      >
                        <Plus className="h-7 w-7 text-gray-700" />
                        <span className="mt-1 text-xs">Add</span>
                      </label>
                    </div>
                  );
                }

                // Future placeholder slots (disabled)
                return (
                  <div
                    key={`ph-${idx}`}
                    className="h-36 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60"
                    aria-hidden
                  />
                );
              })}
            </div>

            {/* Helper text */}
            <p className="text-xs text-gray-500 mt-2">
              Upload up to {MAX_IMAGES} images
            </p>
          </div>

          {/* Location Section */}
          <div
            id="location"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-blue-500"
          >
            <Card className="shadow-sm border border-gray-100 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl text-gray-800">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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

                <div className="mt-4">
                  <TurfLocationPicker
                    coordinates={coordinates}
                    onLocationChange={handleLocationChange}
                    onAddressChange={handleAddressChange}
                    showCard={false}
                    title="Select Your Turf Location"
                  />
                </div>

                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                  Current Coordinates: Lat: {coordinates.lat.toFixed(6)}, Lng:{" "}
                  {coordinates.lng.toFixed(6)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Number */}
          <div
            id="contact"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-green-600"
          >
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
          <div id="pricing" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="-mt-6 -mx-6 mb-4 h-1 rounded-t-xl bg-green-600/80" />
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

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="-mt-6 -mx-6 mb-4 h-1 rounded-t-xl bg-blue-500/80" />
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-green-600">
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
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
          <div
            id="amenities"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-green-600"
          >
            <label className="block text-sm font-semibold text-gray-700">
              Amenities (At least 1 required) *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
              {availableOptions.amenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-3 rounded-lg border-2 transition-colors text-left ${
                    formik.values.amenities.includes(amenity)
                      ? "border-green-600 bg-green-50 text-green-800 shadow-sm"
                      : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>

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
              <p className="text-red-500 text-sm">
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
          <div
            id="status"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-blue-500"
          >
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
            {getFieldError("status") && (
              <p className="text-red-500 text-sm mt-1">
                {getFieldError("status")}
              </p>
            )}
          </div>
          <div className="sticky bottom-0 w-full border-t border-t-green-200 bg-green-50/90">
            <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting
                  ? "Submitting..."
                  : "Submit Turf Registration"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AddTurfPage;
