import type React from "react"
import type { LucideIcon } from "lucide-react"

interface InfoItemProps {
  icon: LucideIcon
  label: string
  value: string | React.ReactNode
  className?: string
}

export const InfoItem = ({ icon: Icon, label, value, className = "" }: InfoItemProps) => {
  return (
    <div className={`flex items-center gap-3 text-sm ${className}`}>
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
        <Icon className="h-4 w-4 text-gray-600" />
      </div>
      <div className="flex-1">
        <span className="text-gray-500 text-xs block">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
      </div>
    </div>
  )
}
