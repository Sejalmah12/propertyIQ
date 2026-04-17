export interface GeoLocation {
  lat: number;
  lng: number;
  city: string;
  state: string;
  formatted_address: string;
}

/** Convert Indian pincode to lat/lng using Google Geocoding API (server-side only) */
export async function pincodeToLatLng(pincode: string): Promise<GeoLocation | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Fallback to Nominatim (free, no key needed) if Google key not set
  if (!apiKey || apiKey === "your-google-maps-api-key") {
    return nominatimGeocode(pincode);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode},India&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" || !data.results.length) {
      return nominatimGeocode(pincode);
    }

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;

    let city = "";
    let state = "";
    for (const comp of result.address_components) {
      if (comp.types.includes("locality")) city = comp.long_name;
      if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
    }

    return { lat, lng, city, state, formatted_address: result.formatted_address };
  } catch {
    return nominatimGeocode(pincode);
  }
}

/** Fallback: Nominatim (OpenStreetMap) — free, no API key required */
async function nominatimGeocode(pincode: string): Promise<GeoLocation | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&addressdetails=1&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "PropLocal/1.0 (proplocal.app)" },
    });
    const data = await res.json();
    if (!data.length) return null;

    const r = data[0];
    return {
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      city: r.address?.city || r.address?.town || r.address?.village || "",
      state: r.address?.state || "",
      formatted_address: r.display_name,
    };
  } catch {
    return null;
  }
}
