"use client";

import { useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import MapEmbed from "@/components/MapEmbed";

const MOCK_MECHANIC: { lat: number; lng: number } = { lat: 37.7899, lng: -122.4044 };

export default function BookPage() {
  const geo = useGeolocation();

  const [form, setForm] = useState({ name: "", phone: "", issue: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const customerPos =
    geo.status === "success" ? { lat: geo.lat, lng: geo.lng } : undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // TODO: POST to your booking API
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-lg mx-auto">
        <a href="/" className="text-sm text-orange-500 hover:underline">← Back</a>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">Book a mechanic</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Fill in your details and we&apos;ll dispatch the nearest available mechanic.
        </p>

        {submitted ? (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-green-700">Booking confirmed!</p>
            <p className="mt-1 text-sm text-green-600">
              Your mechanic is on the way.{" "}
              <a href="/customer/track" className="underline">Open the live tracker</a>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                required type="text" placeholder="Jane Smith" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
              <input
                required type="tel" placeholder="+1 555 000 0000" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What&apos;s the issue?</label>
              <select
                required value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option value="" disabled>Select issue type</option>
                <option>Flat tyre</option>
                <option>Dead battery / jump start</option>
                <option>Engine won&apos;t start</option>
                <option>Out of fuel</option>
                <option>Overheating</option>
                <option>Locked out</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional notes <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                rows={3} value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="E.g. I'm in the parking structure on Level 2…"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>

            {geo.status === "error" && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Location unavailable — the mechanic won&apos;t see your position on the map.{" "}{geo.message}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? "Confirming…" : "Confirm booking"}
            </button>
          </form>
        )}

        {/* Map preview */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            {submitted ? "Mechanic en route" : "Your pickup location"}
          </h2>

          {geo.status === "loading" && (
            <div className="flex items-center justify-center gap-2 h-56 bg-white rounded-xl border border-gray-200 text-gray-400 text-sm">
              <span className="inline-block w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
              Detecting your location…
            </div>
          )}

          {(geo.status === "success" || submitted) && (
            <MapEmbed
              customerMarker={customerPos}
              mechanicMarker={submitted ? MOCK_MECHANIC : undefined}
              center={customerPos}
              className="h-56 shadow-sm border border-gray-200"
              zoom={14}
            />
          )}

          {geo.status === "error" && !submitted && (
            <div className="flex items-center justify-center h-56 bg-white rounded-xl border border-dashed border-gray-300 text-sm text-gray-400">
              Map unavailable without location permission
            </div>
          )}
        </div>
      </div>
    </main>
  );
}