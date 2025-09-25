import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "booking" | "payment"
  className?: string
}

export const StatusBadge = ({ status, variant = "booking", className }: StatusBadgeProps) => {
  const getStatusColor = (status: string, variant: "booking" | "payment") => {
    const normalizedStatus = status.toLowerCase()

    if (variant === "payment") {
      switch (normalizedStatus) {
        case "paid":
          return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
        case "pending":
          return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
        case "failed":
          return "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg"
        default:
          return "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg"
      }
    }

    // booking status
    switch (normalizedStatus) {
      case "confirmed":
      case "active":
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
      case "pending":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
      case "cancelled":
      case "rejected":
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg"
    }
  }

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-semibold capitalize",
        getStatusColor(status, variant),
        className,
      )}
    >
      {status}
    </span>
  )
}
