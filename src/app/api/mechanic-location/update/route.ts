import { NextRequest, NextResponse } from "next/server";

let mechanicPosition: { lat: number; lng: number } = {
  lat: 37.7849,
  lng: -122.4094,
};

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).lat !== "number" ||
    typeof (body as Record<string, unknown>).lng !== "number"
  ) {
    return NextResponse.json(
      { error: "Body must be { lat: number; lng: number }" },
      { status: 422 }
    );
  }

  const { lat, lng } = body as { lat: number; lng: number };

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Coordinates out of range" }, { status: 422 });
  }

  mechanicPosition = { lat, lng };

  return NextResponse.json({ ok: true, lat, lng }, { status: 200 });
}