"""
PropLocal ML Model Training Script
Trains a Linear Regression model on Indian housing data.
Run: python model.py
Saves model.pkl in the same directory.
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "training_data.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")


def generate_synthetic_data(n=1000) -> pd.DataFrame:
    """Generate realistic synthetic Indian property data for initial training."""
    np.random.seed(42)

    # Zones: major Indian city prefixes
    zones = [110, 400, 411, 500, 560, 600, 700, 302, 380, 226, 208, 831, 440]
    zone_base_prices = {
        110: 80000,   # Delhi
        400: 75000,   # Mumbai
        411: 55000,   # Pune
        500: 45000,   # Hyderabad
        560: 60000,   # Bangalore
        600: 50000,   # Chennai
        700: 55000,   # Kolkata
        302: 35000,   # Jaipur
        380: 40000,   # Ahmedabad
        226: 30000,   # Lucknow
        208: 28000,   # Kanpur
        831: 25000,   # Jamshedpur
        440: 32000,   # Nagpur
    }

    records = []
    for _ in range(n):
        zone = np.random.choice(zones)
        base_ppf = zone_base_prices[zone]

        prop_type = np.random.randint(0, 4)
        area = np.random.uniform(400, 5000)
        distance = np.random.uniform(1, 25)
        sold_count = np.random.randint(0, 20)

        # Type multipliers
        type_mult = {0: 0.7, 1: 1.2, 2: 1.0, 3: 1.4}[prop_type]
        # Distance discount (farther = cheaper)
        dist_mult = max(0.5, 1 - (distance / 50))
        # Demand multiplier
        demand_mult = 1 + (sold_count / 40)
        # Random noise ±10%
        noise = np.random.uniform(0.9, 1.1)

        ppf = base_ppf * type_mult * dist_mult * demand_mult * noise
        price = area * ppf

        records.append({
            "area_sqft": round(area, 0),
            "property_type": prop_type,
            "zone_code": zone,
            "distance_from_center": round(distance, 1),
            "nearby_sold_count": sold_count,
            "price": round(price, -3),
        })

    return pd.DataFrame(records)


def train():
    # Load or generate training data
    if os.path.exists(DATA_PATH):
        print(f"📂 Loading data from {DATA_PATH}")
        df = pd.read_csv(DATA_PATH)
    else:
        print("🔧 Generating synthetic training data (1000 samples)...")
        df = generate_synthetic_data(1000)
        os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
        df.to_csv(DATA_PATH, index=False)
        print(f"✅ Saved training data → {DATA_PATH}")

    print(f"📊 Dataset: {len(df)} rows, columns: {list(df.columns)}")

    features = ["area_sqft", "property_type", "zone_code", "distance_from_center", "nearby_sold_count"]
    target = "price"

    X = df[features].values
    y = df[target].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Use Random Forest if enough data, else Linear Regression
    if len(df) >= 500:
        print("🌳 Training Random Forest Regressor...")
        model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    else:
        print("📈 Training Linear Regression...")
        model = LinearRegression()

    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"✅ Model trained!")
    print(f"   MAE  : ₹{mae:,.0f}")
    print(f"   R²   : {r2:.4f}")
    print(f"   Accuracy (within 20%): {np.mean(np.abs(y_pred - y_test) / y_test < 0.2) * 100:.1f}%")

    joblib.dump(model, MODEL_PATH)
    print(f"💾 Model saved → {MODEL_PATH}")


if __name__ == "__main__":
    train()
