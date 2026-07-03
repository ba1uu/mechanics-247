"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import MapEmbed from "@/components/MapEmbed";

const MOCK_ETA_MINUTES = 12;

export default function TrackPage() {
  const geo = useGeolocation();
  const [eta, setEta] = useState(MOCK_ETA_MINUTES);
  const [status, setStatus] = useState<"en-route" | "arrived">("en-route");

  useEffect(() => {
    if (status === "arrived") return;
    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) { setStatus("arrived"); return 0; }
        return prev - 1;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, [status]);

  const customerPos =
    geo.status === "success" ? { lat: geo.lat, lng: geo.lng } : undefined;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Status bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <a href="/customer/book" className="text-sm text-orange-500 hover:underline shrink-0">← Back</a>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {status === "arrived" ? "Mechanic arrived" : "Mechanic en route"}
          </p>
          {status === "en-route" && (
            <p className="text-2xl font-bold text-gray-900 leading-tight">
              {eta} min{eta !== 1 ? "s" : ""}
              <span className="text-sm font-normal text-gray-400 ml-1">estimated</span>
            </p>
          )}
          {status === "arrived" && (
            <p className="text-lg font-semibold text-green-600">Your mechanic is here!</p>
          )}
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
          status === "arrived" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            status === "arrived" ? "bg-green-500" : "bg-orange-500 animate-pulse"
          }`} />
          {status === "arrived" ? "Arrived" : "Live"}
        </span>
      </header>

      {/* Live map */}
      <div className="flex-1 relative">
        {(geo.status === "success" || geo.status === "loading") && (
          <MapEmbed
            liveTrack
            customerMarker={customerPos}
            center={customerPos}
            className="absolute inset-0 rounded-none"
            zoom={15}
          />
        )}
        {geo.status === "idle" && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Waiting for location…
          </div>
        )}
        {geo.status === "error" && (
          <div className="flex items-center justify-center h-full text-center px-6">
            <div className="text-sm text-gray-500">
              <p className="font-medium text-red-400">Location unavailable</p>
              <p className="mt-1 text-xs">{geo.message}</p>
              <p className="mt-3 text-xs text-gray-400">
                The mechanic is still being tracked — enable location to see yourself on the map.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mechanic card */}
      <div className="bg-white border-t border-gray-100 px-6 py-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg shrink-0">
          JR
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">James Rivera</p>
          <p className="text-xs text-gray-400">Toyota Certified · ⭐ 4.9 · 312 jobs</p>
        </div>
        <a
          href="tel:+15550001234"
          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
          </svg>
          Call
        </a>
      </div>
    </main>
  );
}