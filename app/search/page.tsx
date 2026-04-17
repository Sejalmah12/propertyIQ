"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/ListingCard/ListingCard";
import { Search, MapPin, Filter, Loader2, SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES = ["All", "PLOT", "HOUSE", "FLAT", "COMMERCIAL"];
const PRICE_RANGES = [
  { label: "Any", min: 0, max: 999999999 },
  { label: "Under ₹20L", min: 0, max: 2000000 },
  { label: "₹20L - ₹50L", min: 2000000, max: 5000000 },
  { label: "₹50L - ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr - ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: 999999999 },
];

export default function SearchPage() {
  const params = useSearchParams();
  const [pincode, setPincode] = useState(params.get("pincode") || "");
  const [radius, setRadius] = useState(30);
  const [type, setType] = useState("All");
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [listings, setListings] = useState<any[]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const doSearch = useCallback(async () => {
    if (!pincode || pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({
        pincode,
        radius: String(radius),
        minPrice: String(priceRange.min),
        maxPrice: String(priceRange.max),
        ...(type !== "All" ? { type } : {}),
      });
      const res = await fetch(`/api/search?${qs}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Search failed"); return; }
      setListings(data.listings);
      setCenter(data.center);
      setCity(data.city);
      setSearched(true);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pincode, radius, type, priceRange]);

  useEffect(() => {
    if (params.get("pincode")) doSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen pt-20 hero-gradient">
      {/* Search header */}
      <div className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Pincode input */}
            <div className="relative flex-1 max-w-xs">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="search-pincode"
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder="Enter 6-digit pincode"
                className="input-dark w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            {/* Radius */}
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="input-dark px-3 py-2.5 rounded-xl text-sm pr-8"
              id="search-radius"
            >
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={30}>30 km</option>
              <option value={50}>50 km</option>
            </select>

            {/* Search button */}
            <button
              id="search-btn"
              onClick={doSearch}
              disabled={loading}
              className="btn-primary px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn("px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 border transition-all",
                showFilters ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            {/* View toggle */}
            <div className="flex items-center gap-1 glass rounded-xl p-1">
              <button onClick={() => setViewMode("grid")} className={cn("p-1.5 rounded-lg transition-all", viewMode === "grid" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-white")}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={cn("p-1.5 rounded-lg transition-all", viewMode === "list" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-white")}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-3 items-center">
              {/* Type filter */}
              <div className="flex items-center gap-2 flex-wrap">
                {PROPERTY_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      type === t ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-white/10 text-slate-400 hover:text-white"
                    )}
                  >
                    {t === "All" ? "All Types" : t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-white/10" />

              {/* Price filter */}
              <div className="flex items-center gap-2 flex-wrap">
                {PRICE_RANGES.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setPriceRange(r)}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      priceRange.label === r.label ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-white/10 text-slate-400 hover:text-white"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            <X className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {searched && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                {listings.length} {listings.length === 1 ? "property" : "properties"} found
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Near <span className="text-slate-300">{city || pincode}</span> within {radius} km
              </p>
            </div>
          </div>
        )}

        {!searched && !loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/10 flex items-center justify-center mb-6">
              <MapPin className="w-10 h-10 text-emerald-500/50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Find Properties Near You</h2>
            <p className="text-slate-500 max-w-sm">Enter your 6-digit pincode above and hit Search to discover all properties within your radius.</p>
          </div>
        )}

        {listings.length === 0 && searched && !loading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No listings found</h2>
            <p className="text-slate-500 text-sm">Try expanding your radius or adjusting filters.</p>
          </div>
        )}

        <div className={cn(
          "gap-5",
          viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
        )}>
          {listings.map((listing) => (
            <ListingCard key={listing.id} property={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
