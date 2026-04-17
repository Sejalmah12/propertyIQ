import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pincodeToLatLng } from "@/lib/geocode";
import { predictPrice } from "@/lib/ml";


// GET /api/listings — fetch all active listings (with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status") || "ACTIVE";
    const sellerId = searchParams.get("sellerId");

    const where: any = { status };
    if (type) where.type = type;
    if (sellerId) where.sellerId = sellerId;

    const listings = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

// POST /api/listings — create a new property listing
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title, description, type, area_sqft, price,
      pincode, address, photos, seller_name, seller_phone, seller_email,
    } = body;

    // Validate required fields
    if (!title || !type || !area_sqft || !price || !pincode || !address || !seller_name || !seller_phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Geocode pincode → lat/lng
    const geo = await pincodeToLatLng(pincode);
    if (!geo) {
      return NextResponse.json({ error: "Invalid pincode — could not geocode location" }, { status: 400 });
    }

    const price_per_sqft = price / area_sqft;

    // Get ML price prediction (optional, non-blocking)
    const mlResult = await predictPrice(pincode, area_sqft, type, price);

    const property = await prisma.property.create({
      data: {
        title,
        description,
        type,
        area_sqft: parseFloat(area_sqft),
        price: parseFloat(price),
        price_per_sqft,
        pincode,
        address,
        city: geo.city,
        state: geo.state,
        lat: geo.lat,
        lng: geo.lng,
        photos: photos || [],
        seller_name,
        seller_phone,
        seller_email,
        ai_price_min: mlResult?.min ?? null,
        ai_price_max: mlResult?.max ?? null,
        ai_label: mlResult?.label ?? null,
        sellerId: session.user.id,
      },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
