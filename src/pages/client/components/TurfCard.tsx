
import type React from "react"
import { motion } from "framer-motion"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import type { ITurf } from "@/types/Turf"

interface TurfCardProps {
  turf: ITurf
  onSelect: (turfId: string) => void
  index: number
}

const TurfCard: React.FC<TurfCardProps> = ({ turf, onSelect, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={() => onSelect(turf._id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={turf.images[0] || "/placeholder.svg?height=300&width=400&query=sports turf field"}
          alt={turf.turfName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* {turf.distance && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
            {turf.distance} km away
          </div>
        )} */}

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 text-balance">{turf.turfName}</h3>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{turf.location.address}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {turf.openingTime} - {turf.closingTime}
            </span>
          </div>
          {/* <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div> */}
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{turf.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-card-foreground">₹{turf.pricePerHour}</span>
            <span className="text-muted-foreground">/hour</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            Book Now
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {turf.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              {amenity}
            </span>
          ))}
          {turf.amenities.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              +{turf.amenities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TurfCard
