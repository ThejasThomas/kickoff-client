export interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}


export interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}