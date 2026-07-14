/**
 * src/hooks/useGeolocation.ts — FIXED
 *
 * Always returns lat and lng (defaulting to 0).
 * TypeScript will not complain about missing properties.
 */

import { useState, useEffect } from "react";

export interface GeolocationState {
  status:  "idle" | "loading" | "success" | "error";
  lat:     number;   // always present, 0 when unknown
  lng:     number;   // always present, 0 when unknown
  message: string;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    status:  "loading",
    lat:     0,
    lng:     0,
    message: "",
  });

  useEffect(() => {
    if (!navigator?.geolocation) {
      setState({ status: "error", lat: 0, lng: 0, message: "Geolocation not supported by your browser." });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          status:  "success",
          lat:     position.coords.latitude,
          lng:     position.coords.longitude,
          message: "",
        });
      },
      (error) => {
        let message = "Unable to detect location.";
        if (error.code === error.PERMISSION_DENIED)
          message = "Location permission denied. Please allow access in browser settings.";
        else if (error.code === error.POSITION_UNAVAILABLE)
          message = "Location unavailable. Please check your device GPS.";
        else if (error.code === error.TIMEOUT)
          message = "Location request timed out. Please try again.";

        setState({ status: "error", lat: 0, lng: 0, message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}