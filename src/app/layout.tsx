import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mechanics 24/7 — On-Demand Roadside Assistance",
  description: "Get a verified mechanic at your location in under 8 minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Inter', sans-serif" }}>{children}</body>
    </html>
  );
}