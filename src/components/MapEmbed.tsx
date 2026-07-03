"use client";

import { useEffect, useRef, useCallback } from "react";

export interface LatLng {
  lat: number;
  lng: number;
}

interface MapEmbedProps {
  center?: LatLng;
  customerMarker?: LatLng;
  mechanicMarker?: LatLng;
  liveTrack?: boolean;
  className?: string;
  zoom?: number;
}

// Leaflet types (loaded dynamically at runtime)
type LeafletMap = {
  setView: (center: [number, number], zoom: number) => LeafletMap;
  panTo: (latlng: [number, number]) => void;
  fitBounds: (bounds: [[number, number], [number, number]], opts?: object) => void;
  remove: () => void;
};
type LeafletMarker = {
  setLatLng: (latlng: [number, number]) => void;
  addTo: (map: LeafletMap) => LeafletMarker;
};

declare global {
  interface Window {
    L: {
      map: (el: HTMLElement, opts?: object) => LeafletMap;
      tileLayer: (url: string, opts: object) => { addTo: (map: LeafletMap) => void };
      divIcon: (opts: object) => object;
      marker: (latlng: [number, number], opts?: object) => LeafletMarker;
    };
    _leafletLoaded?: boolean;
    _leafletLoading?: boolean;
    _leafletCallbacks?: (() => void)[];
  }
}

function loadLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    if (window._leafletLoaded) { resolve(); return; }

    window._leafletCallbacks = window._leafletCallbacks ?? [];
    window._leafletCallbacks.push(resolve);

    if (window._leafletLoading) return;
    window._leafletLoading = true;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      window._leafletLoaded = true;
      window._leafletLoading = false;
      window._leafletCallbacks?.forEach((cb) => cb());
      window._leafletCallbacks = [];
    };
    document.head.appendChild(script);
  });
}

function makeIcon(color: "orange" | "blue") {
  const bg = color === "orange" ? "#f97316" : "#3b82f6";
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.268 21.732 0 14 0z"
            fill="${bg}" stroke="#fff" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="#fff"/>
    </svg>`;
}

export default function MapEmbed({
  center,
  customerMarker,
  mechanicMarker,
  liveTrack = false,
  className = "",
  zoom = 13,
}: MapEmbedProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const mechanicMarkerRef = useRef<LeafletMarker | null>(null);
  const customerMarkerRef = useRef<LeafletMarker | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const L = window.L;

    const defaultCenter: [number, number] =
      center
        ? [center.lat, center.lng]
        : customerMarker
        ? [customerMarker.lat, customerMarker.lng]
        : mechanicMarker
        ? [mechanicMarker.lat, mechanicMarker.lng]
        : [37.7749, -122.4194];

    const map = L.map(mapRef.current, { zoomControl: true }).setView(defaultCenter, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    if (customerMarker) {
      customerMarkerRef.current = L.marker([customerMarker.lat, customerMarker.lng], {
        icon: L.divIcon({
          html: makeIcon("blue"),
          className: "",
          iconSize: [28, 36],
          iconAnchor: [14, 36],
        }),
        title: "Your location",
      }).addTo(map);
    }

    if (mechanicMarker) {
      mechanicMarkerRef.current = L.marker([mechanicMarker.lat, mechanicMarker.lng], {
        icon: L.divIcon({
          html: makeIcon("orange"),
          className: "",
          iconSize: [28, 36],
          iconAnchor: [14, 36],
        }),
        title: "Mechanic",
      }).addTo(map);
    }

    if (customerMarker && mechanicMarker) {
      map.fitBounds(
        [
          [customerMarker.lat, customerMarker.lng],
          [mechanicMarker.lat, mechanicMarker.lng],
        ],
        { padding: [40, 40] }
      );
    }
  }, [center, customerMarker, mechanicMarker, zoom]);

  const pollMechanicLocation = useCallback(async () => {
    try {
      const res = await fetch("/api/mechanic-location");
      if (!res.ok) return;
      const { lat, lng }: LatLng = await res.json();

      if (mechanicMarkerRef.current) {
        mechanicMarkerRef.current.setLatLng([lat, lng]);
      } else if (mapInstanceRef.current) {
        mechanicMarkerRef.current = window.L.marker([lat, lng], {
          icon: window.L.divIcon({
            html: makeIcon("orange"),
            className: "",
            iconSize: [28, 36],
            iconAnchor: [14, 36],
          }),
          title: "Mechanic",
        }).addTo(mapInstanceRef.current);
      }
    } catch {
      // silently ignore poll failures
    }
  }, []);

  useEffect(() => {
    loadLeaflet().then(() => {
      initMap();
      if (liveTrack) {
        pollMechanicLocation();
        pollIntervalRef.current = setInterval(pollMechanicLocation, 5000);
      }
    });

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [initMap, liveTrack, pollMechanicLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (mechanicMarker && mechanicMarkerRef.current) {
      mechanicMarkerRef.current.setLatLng([mechanicMarker.lat, mechanicMarker.lng]);
    }
    if (customerMarker && customerMarkerRef.current) {
      customerMarkerRef.current.setLatLng([customerMarker.lat, customerMarker.lng]);
    }
    if (center) {
      mapInstanceRef.current.panTo([center.lat, center.lng]);
    }
  }, [mechanicMarker, customerMarker, center]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
      {liveTrack && (
        <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2.5 py-1.5 rounded-full shadow-sm border border-gray-200">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live tracking
        </div>
      )}
      <div className="absolute bottom-8 right-3 z-[1000] flex flex-col gap-1.5 text-xs">
        {customerMarker && (
          <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            You
          </span>
        )}
        {(mechanicMarker || liveTrack) && (
          <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Mechanic
          </span>
        )}
      </div>
    </div>
  );
}