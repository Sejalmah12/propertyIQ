# PropLocal 🏠 — Hyperlocal Property Platform

> India's first hyperlocal property platform. Buy or sell property within **20-30 km** of your pincode. No broker, no commission.

---

## 🚀 Quick Start

### 1. Install Node dependencies
```bash
cd proplocal
npm install
```

### 2. Configure environment variables
Copy `.env.local` and fill in your API keys:
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-token
CLOUDINARY_CLOUD_NAME=...
```

### 3. Run Next.js (frontend + API)
```bash
npm run dev
# → http://localhost:3000
```

### 4. Setup & Run the Python ML Service
```bash
cd ml_service

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Train the model (generates model.pkl)
python model.py

# Start FastAPI server
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

### 5. Setup Database (when you have PostgreSQL)
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio
```

---

## 📁 Project Structure

```
proplocal/
├── app/                    ← Next.js 14 App Router
│   ├── page.tsx            ← Landing page
│   ├── login/              ← Login page
│   ├── register/           ← Register page
│   ├── search/             ← Buyer search + results
│   ├── listing/[id]/       ← Property detail page
│   ├── seller/
│   │   ├── list-property/  ← Add new listing
│   │   └── dashboard/      ← Seller's listings
│   └── api/
│       ├── listings/       ← CRUD API
│       ├── search/         ← Radius search API
│       ├── geocode/        ← Pincode → lat/lng
│       └── ml-predict/     ← ML proxy
├── components/             ← Reusable UI components
├── lib/                    ← Utils, Prisma, auth, ML client
├── prisma/schema.prisma    ← Database schema
└── ml_service/             ← Python FastAPI ML service
    ├── main.py             ← API server
    ├── model.py            ← Training script
    └── data/               ← Training CSV
```

---

## 🔑 Required API Keys

| Service | Free? | Where to get |
|---|---|---|
| Mapbox | ✅ Free 50k loads/mo | mapbox.com |
| Cloudinary | ✅ Free 25GB | cloudinary.com |
| Google Geocoding | ✅ $200 credit/mo | console.cloud.google.com |
| MongoDB Atlas / Supabase | ✅ Free tier | supabase.com |

---

## 🧠 ML Model

The model predicts property price from:
- `area_sqft` — property area
- `property_type` — PLOT/HOUSE/FLAT/COMMERCIAL
- `zone_code` — first 3 digits of pincode
- `distance_from_center` — km from city center
- `nearby_sold_count` — sold listings in last 6 months

**Phase 1** (< 500 rows): Linear Regression  
**Phase 2** (500+ rows): Random Forest  

---

## 🌐 Deploy

| Service | Platform |
|---|---|
| Next.js | Vercel |
| Python ML | Railway / Render |
| PostgreSQL | Supabase |
