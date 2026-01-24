import type { IUpdateClient } from "@/types/User";

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export const validateClientProfile = (
  data: Partial<IUpdateClient>
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = "Full name is required";
  } else if (data.fullName.length < 3) {
    errors.fullName = "Full name must be at least 3 characters";
  } else if (!/^[A-Za-z ]+$/.test(data.fullName)) {
    errors.fullName = "Full name can contain only letters";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.email = "Invalid email address";
  }

  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!/^[0-9]{10}$/.test(data.phoneNumber)) {
    errors.phoneNumber = "Phone number must be 10 digits";
  }

  return errors;
};
