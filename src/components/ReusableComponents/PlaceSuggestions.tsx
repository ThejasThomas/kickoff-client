// PlaceSuggestions.tsx - New Reusable Component
import React, { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Map, Loader2 } from "lucide-react"

interface PlaceSuggestion {
  description: string
  place_id: string
}

interface PlaceSuggestionsProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect?: (place: PlaceSuggestion, details?: google.maps.places.PlaceResult) => void
  placeholder?: string
  loading?: boolean
  className?: string
  inputClassName?: string
  debounceDelay?: number
  country?: string // e.g., "in" for India
  types?: string[] // e.g., ["geocode"]
}

const PlaceSuggestions: React.FC<PlaceSuggestionsProps> = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Search by location...",
  loading = false,
  className = "",
  inputClassName = "w-full pl-14 pr-4 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg",
  debounceDelay = 300,
  country = "in",
  types = ["geocode"],
}) => {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)

  // Load Google Maps script if not loaded
  useEffect(() => {
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        initializeServices()
      }
      document.head.appendChild(script)
    } else if (window.google) {
      initializeServices()
    }
  }, [])

  const initializeServices = () => {
    if (window.google && window.google.maps) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
      const dummyDiv = document.createElement("div")
      dummyDiv.style.display = "none"
      document.body.appendChild(dummyDiv)
      placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDiv)
      setIsInitialized(true)
    }
  }

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = () => {
      if (!value || value.length < 2 || !autocompleteServiceRef.current || !isInitialized) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          types: types,
          componentRestrictions: { country },
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions)
            setShowSuggestions(true)
          } else {
            setSuggestions([])
            setShowSuggestions(false)
          }
        }
      )
    }

    const timer = setTimeout(fetchSuggestions, debounceDelay)

    return () => clearTimeout(timer)
  }, [value, isInitialized, debounceDelay, country, types])

  const handleSuggestionSelect = useCallback((suggestion: PlaceSuggestion) => {
    onChange(suggestion.description)
    setShowSuggestions(false)

    if (onPlaceSelect && placesServiceRef.current && suggestion.place_id) {
      placesServiceRef.current.getDetails(
        { placeId: suggestion.place_id },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            onPlaceSelect(suggestion, place)
          }
        }
      )
    } else if (onPlaceSelect) {
      onPlaceSelect(suggestion)
    }
  }, [onChange, onPlaceSelect])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    if (isInitialized) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isInitialized])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  if (!isInitialized) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center">
          <Loader2 className="absolute left-6 w-5 h-5 text-gray-400 animate-spin" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={placeholder}
            className={inputClassName}
            disabled
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center relative">
        <Search className="absolute left-6 w-5 h-5 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClassName}
        />
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.place_id}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-full text-left px-6 py-3 hover:bg-emerald-50 transition-colors duration-200 flex items-center gap-3"
              >
                <Map className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 text-sm leading-tight">{suggestion.description}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PlaceSuggestions