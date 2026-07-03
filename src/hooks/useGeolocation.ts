"use client";

import { useState, useEffect } from "react";

export type GeolocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; lat: number; lng: number }
  | { status: "error"; message: string };

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({ status: "idle" });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ status: "error", message: "Geolocation is not supported by your browser." });
      return;
    }

    setState({ status: "loading" });

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          status: "success",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setState({ status: "error", message: err.message });
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 30_000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}