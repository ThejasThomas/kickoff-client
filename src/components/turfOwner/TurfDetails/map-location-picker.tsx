import type { LocationCoordinates } from "@/types/Turf";
import { MapPin } from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

// Component to handle map clicks
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
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const newCoords = { lat: latitude, lng: longitude };

        // Update marker position
        onLocationChange?.(newCoords);

        // Reverse geocode and update address
        if (onAddressChange) {
          const addressData = await reverseGeocode(latitude, longitude);
          if (addressData) {
            onAddressChange({
              address: addressData.address,
              city: addressData.city,
              state: addressData.state,
            });
          }
        }
      },
      (error) => {
        console.error("Location Error:", error);
        alert("Unable to retrieve your location.");
      }
    );
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
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            Use Current Location
          </button>
        </div>
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
