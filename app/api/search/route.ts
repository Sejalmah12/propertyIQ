import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pincodeToLatLng } from "@/lib/geocode";
import { haversineDistance } from "@/lib/utils";

// GET /api/search?pincode=411001&radius=30&type=HOUSE&minPrice=0&maxPrice=999999999
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");
    const radius = parseFloat(searchParams.get("radius") || "30");
    const type = searchParams.get("type");
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999999");
    const minArea = parseFloat(searchParams.get("minArea") || "0");

    if (!pincode) {
      return NextResponse.json({ error: "Pincode is required" }, { status: 400 });
    }

    // Step 1: Convert pincode → lat/lng
    const center = await pincodeToLatLng(pincode);
    if (!center) {
      return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
    }

    // Step 2: Fetch all active listings from DB
    const where: any = {
      status: "ACTIVE",
      price: { gte: minPrice, lte: maxPrice },
      area_sqft: { gte: minArea },
    };
    if (type) where.type = type;

    const allListings = await prisma.property.findMany({ where, orderBy: { createdAt: "desc" }, take: 500 });

    // Step 3: Filter by haversine distance (radius in km)
    const radiusMeters = radius * 1000;
    const nearby = allListings
      .map((listing) => ({
        ...listing,
        distance_m: haversineDistance(center.lat, center.lng, listing.lat, listing.lng),
      }))
      .filter((l) => l.distance_m <= radiusMeters)
      .sort((a, b) => a.distance_m - b.distance_m);

    return NextResponse.json({
      listings: nearby,
      center: { lat: center.lat, lng: center.lng },
      city: center.city,
      total: nearby.length,
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
