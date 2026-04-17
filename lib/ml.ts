export interface MLPredictInput {
  area_sqft: number;
  property_type: number; // 0=PLOT, 1=HOUSE, 2=FLAT, 3=COMMERCIAL
  zone_code: number;     // first 3 digits of pincode
  distance_from_center: number;
  nearby_sold_count: number;
}

export interface MLPredictOutput {
  predicted_price: number;
  min: number;
  max: number;
  price_per_sqft: number;
  confidence: "low" | "medium" | "high";
  label: "Fair Deal" | "Overpriced" | "Underpriced";
}

const PROPERTY_TYPE_MAP: Record<string, number> = {
  PLOT: 0,
  HOUSE: 1,
  FLAT: 2,
  COMMERCIAL: 3,
};

export async function predictPrice(
  pincode: string,
  area_sqft: number,
  property_type: string,
  asking_price?: number
): Promise<MLPredictOutput | null> {
  try {
    const zone_code = parseInt(pincode.substring(0, 3));
    const typeCode = PROPERTY_TYPE_MAP[property_type] ?? 1;

    const payload: MLPredictInput = {
      area_sqft,
      property_type: typeCode,
      zone_code,
      distance_from_center: 5, // default; will be computed more precisely later
      nearby_sold_count: 3,
    };

    const ML_URL = process.env.ML_API_URL || "http://localhost:8000";
    const res = await fetch(`${ML_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;
    const data: MLPredictOutput = await res.json();

    // Determine label based on asking price vs predicted
    if (asking_price) {
      const ratio = asking_price / data.predicted_price;
      data.label =
        ratio > 1.15 ? "Overpriced" : ratio < 0.85 ? "Underpriced" : "Fair Deal";
    }

    return data;
  } catch {
    return null; // ML service might not be running; graceful degradation
  }
}
