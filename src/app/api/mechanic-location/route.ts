import { NextResponse } from "next/server";

let mechanicPosition = {
  lat: 37.7849,
  lng: -122.4094,
};

export async function GET() {
  return NextResponse.json(mechanicPosition, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}