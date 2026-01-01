import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
};


export const isCancellationAllowed = (
  bookingDate: string,
  startTime: string
): boolean => {

  const now = new Date();

  const bookingStart = new Date(`${bookingDate}T${startTime}:00`);

  const diffMs = bookingStart.getTime() - now.getTime();

  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours > 1;
};




