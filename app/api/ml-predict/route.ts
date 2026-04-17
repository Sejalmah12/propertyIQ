import { NextRequest, NextResponse } from "next/server";
import { predictPrice } from "@/lib/ml";

// POST /api/ml-predict
export async function POST(req: NextRequest) {
  try {
    const { pincode, area_sqft, property_type, asking_price } = await req.json();

    if (!pincode || !area_sqft || !property_type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await predictPrice(pincode, area_sqft, property_type, asking_price);
    if (!result) {
      return NextResponse.json({ error: "ML service unavailable" }, { status: 503 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
  }
}
