import { NextRequest, NextResponse } from "next/server";
import { pincodeToLatLng } from "@/lib/geocode";

// GET /api/geocode?pincode=411001
export async function GET(req: NextRequest) {
  const pincode = new URL(req.url).searchParams.get("pincode");
  if (!pincode) return NextResponse.json({ error: "Pincode required" }, { status: 400 });

  const result = await pincodeToLatLng(pincode);
  if (!result) return NextResponse.json({ error: "Pincode not found" }, { status: 404 });

  return NextResponse.json(result);
}
