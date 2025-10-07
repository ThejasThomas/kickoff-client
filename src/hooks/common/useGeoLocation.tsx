import type { GeolocationState, UseGeolocationOptions } from "@/types/GeoLocation_type"
import { useState } from "react"

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser.",
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        })
      },
      (error) => {
        let errorMessage = "An unknown error occurred."
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }))
      },
      {
        enableHighAccuracy: options.enableHighAccuracy || true,
        timeout: options.timeout || 15000,
        maximumAge: options.maximumAge || 0,
      },
    )
  }

  return {
    ...state,
    getCurrentPosition,
  }
}