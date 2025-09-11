import * as Yup from "yup";

export const turfSchema = Yup.object().shape({
  turfName: Yup.string().trim()
    .min(3, "Turf name must be at least 3 characters")
    .max(100, "Turf name cannot exceed 100 characters")
    .required("Turf name is required"),

  description: Yup.string().trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .required("Description is required"),

  address: Yup.string().trim().required("Address is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().optional(),

  latitude: Yup.string()
    .required("Latitude is required")
    .matches(/^-?\d+\.?\d*$/, "Latitude must be a valid number"),
  longitude: Yup.string()
    .required("Longitude is required")
    .matches(/^-?\d+\.?\d*$/, "Longitude must be a valid number"),

  amenities: Yup.array()
    .of(Yup.string().required("Amenity must be a string"))
    .min(1, "At least one amenity is required"),

  images: Yup.array()
    .of(Yup.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required"),

  contactNumber: Yup.string().trim()
    .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),

  status: Yup.string()
    .oneOf(["active", "inactive"], "Status must be active or inactive")
    .required("Status is required"),

  pricePerHour: Yup.string().trim()
    .matches(/^\d+(\.\d{1,2})?$/, "Price must be a valid number")
    .required("Price per hour is required"),

  courtType: Yup.string().trim()
    .matches(
      /^\d+x\d+$/,
      "Court size must be in format 'widthxlength' (e.g., 5x5)"
    )
    .required("Court size is required"),

  createdAt: Yup.date().optional(),
  updatedAt: Yup.date().optional(),
});
