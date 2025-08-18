import * as Yup from "yup";

export const turfOwnerSchema = Yup.object({
  ownerName: Yup.string()
    .trim()
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Owner name should only contain letters, numbers, and spaces"
    )
    .min(2, "Owner name must be at least 2 characters")
    .max(50, "Owner name must not exceed 50 characters")
    .required("Turf name is required"),

  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .max(100, "Email must not exceed 100 characters")
    .required("Email is required"),

  phoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});
