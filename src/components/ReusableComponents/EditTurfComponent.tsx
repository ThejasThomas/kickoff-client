import React, { useState, useRef, useEffect } from "react";
import { MapPin, Phone, Trash2, Plus, ArrowLeft } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { LocationCoordinates, NewTurf } from "@/types/Turf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TurfLocationPicker from "../turfOwner/TurfDetails/map-location-picker";
import { useImageUploader, type UploadedImage } from "@/hooks/common/ImageUploader";
import type { ITurf } from "@/types/Turf";

interface ImageType {
  file?: File;
  preview: string;
  id: number;
  cloudinaryUrl?: string;
  isUploading?: boolean;
}

interface EditTurfPageProps {
  turf: ITurf;
  onSubmit: (data: NewTurf) => void;
  onCancel?: () => void;
  isUpdating?: boolean;
}

const turfSchema = Yup.object({
  turfName: Yup.string().required("Turf name is required").min(3, "Turf name must be at least 3 characters"),
  description: Yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().nullable(),
  contactNumber: Yup.string()
    .required("Contact number is required")
    .matches(/^\d{10}$/, "Contact number must be 10 digits"),
  longitude: Yup.string().required("Longitude is required").matches(/^-?\d+(\.\d+)?$/, "Invalid longitude format"),
  latitude: Yup.string().required("Latitude is required").matches(/^-?\d+(\.\d+)?$/, "Invalid latitude format"),
  amenities: Yup.array().min(1, "At least one amenity is required"),
  pricePerHour: Yup.string()
    .required("Price per hour is required")
    .matches(/^\d+(\.\d{0,2})?$/, "Price must be a valid number (e.g., 500 or 500.00)"),
  courtType: Yup.string().required("Court type is required"),
  status: Yup.string().required("Status is required").oneOf(["active", "inactive", "pending"]), // Allow "pending"
});

const EditTurfPage: React.FC<EditTurfPageProps> = ({
  turf,
  onSubmit,
  onCancel,
  isUpdating = false,
}) => {
  console.log("turff", turf);
  const defaultCoordinates: LocationCoordinates = { lat: 12.9716, lng: 77.5946 };

  const getInitialCoordinates = (): LocationCoordinates => {
    console.log("Getting initial coordinates from turf:", turf);
    if (turf?.location?.coordinates?.coordinates) {
      const coords = turf.location.coordinates.coordinates;
      if (Array.isArray(coords) && coords.length >= 2) {
        return {
          lng: coords[0] ?? defaultCoordinates.lng,
          lat: coords[1] ?? defaultCoordinates.lat,
        };
      }
    }
    return defaultCoordinates;
  };

  const [coordinates, setCoordinates] = useState<LocationCoordinates>(getInitialCoordinates());
  const MAX_IMAGES = 10;
  const addInputRef = useRef<HTMLInputElement | null>(null);
  const { images, handleImageUpload, removeImage, setImages } = useImageUploader("turf-images", MAX_IMAGES);
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

  const getInitialValues = () => {
    console.log("Getting initial values from turf:", turf);

    const coords = getInitialCoordinates();
    const validStatus = ["active", "inactive", "pending"].includes(turf?.status)
      ? turf.status
      : "active"; // Default to "active" if status is invalid

    const initialValues = {
      turfName: turf?.turfName ?? "",
      description: turf?.description ?? "",
      address: turf?.location?.address ?? "",
      city: turf?.location?.city ?? "",
      state: turf?.location?.state ?? "",
      contactNumber: turf?.contactNumber ?? "",
      longitude: coords.lng.toString(),
      latitude: coords.lat.toString(),
      amenities: Array.isArray(turf?.amenities) ? turf.amenities : [],
      pricePerHour: turf?.pricePerHour?.toString() ?? "",
      courtType: turf?.courtType ?? "",
      status: validStatus,
    };

    console.log("Initial values calculated:", initialValues);
    return initialValues;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: turfSchema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (images.length === 0) {
        alert("Please upload at least one image");
        return;
      }

      const uploadedImages = images.filter((img) => img.cloudinaryUrl);
      if (uploadedImages.length === 0 && images.some((img) => img.isUploading)) {
        alert("Please wait for at least one image to finish uploading");
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
        pricePerHour:Number.parseFloat(values.pricePerHour),
        courtType: values.courtType,
        status: values.status as "pending" | "active" | "inactive",
        updatedAt: new Date(),
      };

      console.log("Submitting turf data:", turfData);
      onSubmit(turfData);
    },
  });

  useEffect(() => {
    const anyUploading = images.some((img) => img.isUploading);
    setIsUploadingImages(anyUploading);
    console.log("isUploadingImages updated:", anyUploading);
  }, [images]);

  useEffect(() => {
    console.log("Setting up images from turf data:", turf?.images);
    if (turf?.images && Array.isArray(turf.images) && turf.images.length > 0) {
      const initialImages: UploadedImage[] = turf.images
        .filter((url): url is string => typeof url === "string" && url.trim() !== "")
        .map((url, index) => ({
          id: index + 1,
          preview: url,
          cloudinaryUrl: url,
          isUploading: false,
        }));
      console.log("Setting initial images:", initialImages);
      setImages(initialImages);
    } else {
      console.log("No images found in turf data");
      setImages([]);
    }
  }, [turf?.images, setImages]);

  useEffect(() => {
    if (turf?.amenities && Array.isArray(turf.amenities) && turf.amenities.length > 0) {
      const newAmenities = turf.amenities.filter(
        (amenity) => typeof amenity === "string" && !availableOptions.amenities.includes(amenity)
      );
      if (newAmenities.length > 0) {
        console.log("Adding new amenities to available options:", newAmenities);
        setAvailableOptions((prev) => ({
          ...prev,
          amenities: [...prev.amenities, ...newAmenities],
        }));
      }
    }
  }, [turf?.amenities]);

  useEffect(() => {
    if (turf?.courtType && typeof turf.courtType === "string" && !availableOptions.courtTypes.includes(turf.courtType)) {
      console.log("Adding new court type to available options:", turf.courtType);
      setAvailableOptions((prev) => ({
        ...prev,
        courtTypes: [...prev.courtTypes, turf.courtType],
      }));
    }
  }, [turf?.courtType]);

  useEffect(() => {
    console.log("Turf data changed, resetting form:", turf);
    if (turf) {
      const newValues = getInitialValues();
      const newCoords = getInitialCoordinates();
      console.log("Resetting form with values:", newValues);
      console.log("Resetting coordinates to:", newCoords);
      formik.resetForm({ values: newValues });
      setCoordinates(newCoords);
    }
  }, [turf?._id]);

  const getFieldError = (fieldName: keyof typeof formik.values) =>
    formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : null;

  const handleCustomInputChange = (field: keyof typeof customInputs, value: string) =>
    setCustomInputs((prev) => ({ ...prev, [field]: value }));

  const addNewAmenity = () => {
    const v = customInputs.newAmenity.trim();
    if (v && !availableOptions.amenities.includes(v)) {
      setAvailableOptions((p) => ({ ...p, amenities: [...p.amenities, v] }));
      setCustomInputs((p) => ({ ...p, newAmenity: "" }));
      formik.setFieldValue("amenities", [...formik.values.amenities, v]);
    }
  };

  const addNewCourtType = () => {
    const v = customInputs.newCourtType.trim();
    if (v && !availableOptions.courtTypes.includes(v)) {
      setAvailableOptions((p) => ({ ...p, courtTypes: [...p.courtTypes, v] }));
      setCustomInputs((p) => ({ ...p, newCourtType: "" }));
      formik.setFieldValue("courtType", v);
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

  const handleAddressChange = (addressData: { address: string; city: string; state: string }) => {
    if (addressData.address) formik.setFieldValue("address", addressData.address);
    if (addressData.city) formik.setFieldValue("city", addressData.city);
    if (addressData.state) formik.setFieldValue("state", addressData.state);
  };

  const handleCancel = () => {
    images.forEach((img) => {
      if (img.preview && !img.cloudinaryUrl) URL.revokeObjectURL(img.preview);
    });
    formik.resetForm();
    setImages([]);
    setCustomInputs({ newAmenity: "", newCourtType: "" });
    setCoordinates(getInitialCoordinates());
    if (onCancel) onCancel();
    else if (typeof window !== "undefined") window.history.back();
  };

  const canSubmit = () => {
    const hasValidImages = images.length > 0;
    const isFormValid = formik.isValid && formik.dirty;
    console.log("canSubmit check:", {
      isFormValid,
      hasValidImages,
      isUploadingImages,
      isUpdating,
      formErrors: formik.errors,
      formTouched: formik.touched,
      formDirty: formik.dirty,
      formValues: formik.values,
    });
    return isFormValid && hasValidImages && !isUploadingImages && !isUpdating;
  };

  console.log("=== DEBUG INFO ===");
  console.log("Current turf prop:", turf);
  console.log("Current form values:", formik.values);
  console.log("Current coordinates:", coordinates);
  console.log("Current images:", images);
  console.log("Form is valid:", formik.isValid);
  console.log("Form is dirty:", formik.dirty);
  console.log("Form errors:", formik.errors);
  console.log("Form touched:", formik.touched);

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
          <h1 className="ml-2 text-xl font-semibold">Edit Turf</h1>
        </div>
      </header>

      <div className="bg-blue-50/70 border-y border-blue-100">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
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
            {turf?.turfName && (
              <div className="text-sm text-blue-700 font-medium">
                Editing: {turf.turfName}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
          <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
          <div className="space-y-1 text-yellow-700">
            <div>Turf Name: {formik.values.turfName || "empty"}</div>
            <div>Contact: {formik.values.contactNumber || "empty"}</div>
            <div>Price: {formik.values.pricePerHour || "empty"}</div>
            <div>Court Type: {formik.values.courtType || "empty"}</div>
            <div>Status: {formik.values.status || "empty"}</div>
            <div>Images: {images.length}</div>
            <div>Amenities: {formik.values.amenities.join(", ") || "none"}</div>
            <div>Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</div>
            <div>Turf Prop Exists: {turf ? "Yes" : "No"}</div>
            <div>Form Valid: {formik.isValid.toString()}</div>
            <div>Form Dirty: {formik.dirty.toString()}</div>
            {Object.keys(formik.errors).length > 0 && (
              <div>Form Errors: {JSON.stringify(formik.errors)}</div>
            )}
            {turf && (
              <>
                <div>Original Turf Name: {turf.turfName || "empty"}</div>
                <div>Original Contact: {turf.contactNumber || "empty"}</div>
                <div>Original Price: {turf.pricePerHour || "empty"}</div>
                <div>Original Status: {turf.status || "empty"}</div>
              </>
            )}
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
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
              <p className="text-red-500 text-sm mt-1">{getFieldError("turfName")}</p>
            )}
          </div>

          <div
            id="images"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-blue-500"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Turf Images
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: MAX_IMAGES }).map((_, idx) => {
                const img = images[idx] as ImageType | undefined;
                const isAddSlot = idx === images.length && images.length < MAX_IMAGES;
                const isPlaceholder = idx > images.length || images.length === MAX_IMAGES;

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
                        className={`w-full h-full object-cover ${img.isUploading ? "opacity-50" : ""}`}
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

                if (isAddSlot) {
                  return (
                    <div
                      key={`add-${idx}`}
                      className="h-36 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
                    >
                      <input
                        ref={addInputRef}
                        id="image-upload-next"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleImageUpload(e.target.files);
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

                return (
                  <div
                    key={`ph-${idx}`}
                    className="h-36 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60"
                    aria-hidden
                  />
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Upload up to {MAX_IMAGES} images ({images.length} uploaded)
            </p>
          </div>

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
                      <p className="text-red-500 text-sm mt-1">{getFieldError("address")}</p>
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
                        <p className="text-red-500 text-sm mt-1">{getFieldError("city")}</p>
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
                        <p className="text-red-500 text-sm mt-1">{getFieldError("state")}</p>
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
                  Current Coordinates: Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            id="contact"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-green-600"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
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
              <p className="text-red-500 text-sm mt-1">{getFieldError("contactNumber")}</p>
            )}
          </div>

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
                <p className="text-red-500 text-sm mt-1">{getFieldError("pricePerHour")}</p>
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
                <p className="text-red-500 text-sm mt-1">{getFieldError("courtType")}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-green-600">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Custom Court Type
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInputs.newCourtType}
                onChange={(e) => handleCustomInputChange("newCourtType", e.target.value)}
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
              <p className="text-red-500 text-sm mt-1">{getFieldError("description")}</p>
            )}
          </div>

          <div
            id="amenities"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-green-600"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                      ? "border-green-600 bg-green-50 text-green-800 shadow-sm"
                      : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customInputs.newAmenity}
                onChange={(e) => handleCustomInputChange("newAmenity", e.target.value)}
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
              <p className="text-red-500 text-sm mb-2">{getFieldError("amenities")}</p>
            )}
            {formik.values.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
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
              <option value="pending">Pending</option>
            </select>
            {getFieldError("status") && (
              <p className="text-red-500 text-sm mt-1">{getFieldError("status")}</p>
            )}
          </div>

          <div className="sticky bottom-0 w-full border-t border-t-green-200 bg-green-50/90 backdrop-blur-sm">
            <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdating && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isUpdating ? "Updating..." : "Update Turf"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default EditTurfPage;