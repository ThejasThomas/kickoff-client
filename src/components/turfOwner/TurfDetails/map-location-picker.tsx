"use client";

import type { LocationCoordinates } from "@/types/Turf";
import { MapPin, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@mui/material";

interface TurfLocationPickerProps {
  coordinates: LocationCoordinates;
  onLocationChange?: (coords: LocationCoordinates) => void;
  onAddressChange?: (address: {
    address: string;
    city: string;
    state: string;
  }) => void;
  height?: string;
  showCard?: boolean;
  title?: string;
  readonly?: boolean;
}

const OPENCAGE_API_KEY = "78eb4ee3dbbf4572b7e69d56f5252fb2";

const forwardGeocode = async (searchQuery: string) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        searchQuery
      )}&key=${OPENCAGE_API_KEY}&countrycode=in&limit=1`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.lat,
        lng: result.geometry.lng,
        address: result.formatted,
        city:
          result.components.city ||
          result.components.town ||
          result.components.village ||
          "",
        state: result.components.state || result.components.region || "",
      };
    }
    return null;
  } catch (error) {
    console.error("OpenCage forward geocoding failed:", error);
    return null;
  }
};

const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const components = data.results[0].components;

      return {
        address: data.results[0].formatted,
        city: components.city || components.town || components.village || "",
        state: components.state || components.region || "",
        country: components.country || "",
        postcode: components.postcode || "",
      };
    }
    return null;
  } catch (error) {
    console.error("OpenCage reverse geocoding failed:", error);
    return null;
  }
};

const LocationPicker = ({
  onLocationChange,
  onAddressChange,
}: {
  onLocationChange: (coords: LocationCoordinates) => void;
  onAddressChange?: (address: {
    address: string;
    city: string;
    state: string;
  }) => void;
}) => {
  useMapEvents({
    async click(e: any) {
      const newCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
      console.log("Map clicked at:", newCoords);
      onLocationChange(newCoords);

      if (onAddressChange) {
        try {
          const addressData = await reverseGeocode(e.latlng.lat, e.latlng.lng);
          if (addressData) {
            console.log("Reverse geocoding results:", addressData);
            onAddressChange({
              address: addressData.address,
              city: addressData.city,
              state: addressData.state,
            });
          }
        } catch (error) {
          console.error("Error in reverse geocoding:", error);
        }
      }
    },
  });
  return null;
};

// Component to update map center when coordinates change
const MapUpdater = ({ coordinates }: { coordinates: LocationCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      map.setView([coordinates.lat, coordinates.lng], map.getZoom());
    }
  }, [coordinates.lat, coordinates.lng, map]);

  return null;
};

const getDirectionUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

export default function TurfLocationPicker({
  coordinates,
  onLocationChange,
  onAddressChange,
  height = "400px",
  showCard = true,
  title,
  readonly = false,
}: TurfLocationPickerProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const displayTitle =
    title !== undefined ? title : !readonly ? "Select Location" : "Location";

  const safeCoordinates = useMemo(
    () => ({
      lat: coordinates?.lat || 12.9716,
      lng: coordinates?.lng || 77.5946,
    }),
    [coordinates]
  );

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser. Please update your browser or enter location manually."
      );
      return;
    }

    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      alert(
        "Geolocation requires a secure connection (HTTPS). Please access this site via HTTPS."
      );
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;

          console.log("[v0] GPS accuracy (meters):", accuracy);
          console.log("[v0] Location retrieved:", { latitude, longitude });

          const newCoords = { lat: latitude, lng: longitude };

          if (onLocationChange) {
            onLocationChange(newCoords);
            console.log("[v0] Location updated successfully");
          } else {
            console.error("[v0] onLocationChange callback not provided");
          }

          if (onAddressChange) {
            const addressData = await reverseGeocode(latitude, longitude);
            if (addressData) {
              onAddressChange({
                address: addressData.address,
                city: addressData.city,
                state: addressData.state,
              });
              console.log("[v0] Address updated successfully");
            }
          }
        } catch (error) {
          console.error("[v0] Error processing location:", error);
          alert("Error processing your location. Please try again.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        console.error("[v0] Location Error:", error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert(
              "Location permission denied. Please enable location access in your browser settings and try again."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            alert(
              "Location information is unavailable. Please check your device's location settings."
            );
            break;
          case error.TIMEOUT:
            alert(
              "Location request timed out. Please try again or check your GPS signal."
            );
            break;
          default:
            alert("Unable to retrieve your location: " + error.message);
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a location to search");
      return;
    }

    setIsSearching(true);

    try {
      const result = await forwardGeocode(searchQuery);

      if (result) {
        const newCoords = { lat: result.lat, lng: result.lng };

        if (onLocationChange) {
          onLocationChange(newCoords);
        }

        if (onAddressChange) {
          onAddressChange({
            address: result.address,
            city: result.city,
            state: result.state,
          });
        }

        setSearchQuery(""); // Clear search after success
      } else {
        alert(
          "Location not found. Please try a different search term (e.g., 'Maradu, Kochi')"
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching for location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const center = useMemo(
    () => [safeCoordinates.lat, safeCoordinates.lng] as [number, number],
    [safeCoordinates.lat, safeCoordinates.lng]
  );

  const markerPosition = useMemo(
    () => [safeCoordinates.lat, safeCoordinates.lng] as [number, number],
    [safeCoordinates.lat, safeCoordinates.lng]
  );

  const mapContent = (
    <div className="space-y-4">
      {!readonly && (
        <>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search location (e.g., Maradu, Kochi)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchLocation()}
                className="pl-10"
                disabled={isSearching}
              />
            </div>
            <Button
              onClick={handleSearchLocation}
              disabled={isSearching}
              variant="outline"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLoadingLocation}
              className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingLocation && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {isLoadingLocation
                ? "Getting Location..."
                : "Use Current Location"}
            </button>
          </div>
        </>
      )}
      <div
        style={{ height }}
        className="w-full rounded-lg overflow-hidden shadow-md"
      >
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={true}
          key={`map-${Math.floor(safeCoordinates.lat * 1000)}-${Math.floor(
            safeCoordinates.lng * 1000
          )}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={markerPosition} />

          <MapUpdater coordinates={safeCoordinates} />

          {!readonly && onLocationChange && (
            <LocationPicker
              onLocationChange={onLocationChange}
              onAddressChange={onAddressChange}
            />
          )}
        </MapContainer>
      </div>

      {/* Coordinates display */}
      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-green-600" />
          <span>
            Selected coordinates: {safeCoordinates.lat.toFixed(6)},{" "}
            {safeCoordinates.lng.toFixed(6)}
          </span>
        </div>
        {readonly && (
          <a
            href={getDirectionUrl(safeCoordinates.lat, safeCoordinates.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 text-green-700 hover:underline text-sm"
          >
            Get Directions
          </a>
        )}
      </div>

      {/* Instructions for interactive mode */}
      {!readonly && (
        <p className="text-sm text-gray-600">
          Click on the map to select your turf's location
        </p>
      )}
    </div>
  );

  // Handle showCard prop properly
  if (!showCard) {
    return mapContent;
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl text-gray-800">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          {displayTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>{mapContent}</CardContent>
    </Card>
  );
}
