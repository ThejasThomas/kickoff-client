import * as Yup from "yup";

export const clientSignupSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .matches(/^[a-zA-Z\s]+$/, "Full name should only contain letters")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must not exceed 50 characters")
    .required("Full name is required"),

  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .max(100, "Email must not exceed 100 characters")
    .required("Email is required"),

  phoneNumber: Yup.string()
    .trim()
    .matches(/^\+?[1-9]\d{9,14}$/, "Invalid phone number")
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
    .required("Confirm Password is required"),
});
