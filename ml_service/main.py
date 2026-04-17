"""
PropLocal ML Service — FastAPI price prediction server
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(title="PropLocal ML Service", version="1.0.0")

# Allow Next.js to call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Load model on startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"✅ Model loaded from {MODEL_PATH}")
    else:
        print("⚠️  model.pkl not found — run model.py first to train the model")


class PredictInput(BaseModel):
    area_sqft: float
    property_type: int      # 0=PLOT, 1=HOUSE, 2=FLAT, 3=COMMERCIAL
    zone_code: int          # First 3 digits of pincode (e.g. 411)
    distance_from_center: float = 5.0
    nearby_sold_count: int = 3


class PredictOutput(BaseModel):
    predicted_price: float
    min: float
    max: float
    price_per_sqft: float
    confidence: str
    label: str


@app.get("/")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict", response_model=PredictOutput)
def predict(data: PredictInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Run model.py first.")

    X = np.array([[
        data.area_sqft,
        data.property_type,
        data.zone_code,
        data.distance_from_center,
        data.nearby_sold_count,
    ]])

    predicted = float(model.predict(X)[0])
    predicted = max(predicted, 50000)  # floor at ₹50k

    # ±15% confidence band
    min_price = round(predicted * 0.85, -3)
    max_price = round(predicted * 1.15, -3)
    price_per_sqft = round(predicted / data.area_sqft, 2) if data.area_sqft else 0

    # Confidence based on training data coverage
    confidence = "medium"
    if data.zone_code in [110, 400, 411, 560, 600, 700]:  # Major city zones
        confidence = "high"
    elif data.zone_code < 200:
        confidence = "low"

    return PredictOutput(
        predicted_price=round(predicted, -3),
        min=min_price,
        max=max_price,
        price_per_sqft=price_per_sqft,
        confidence=confidence,
        label="Fair Deal",  # Label is set by Next.js comparing to asking price
    )
