"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PriceEstimate from "@/components/PriceEstimate/PriceEstimate";
import EMICalculator from "@/components/EMICalculator";
import { formatPrice, formatArea, formatDistance, getPropertyTypeLabel } from "@/lib/utils";
import { MapPin, Maximize2, Phone, Mail, ArrowLeft, Share2, Home, TreePine, Building2, Briefcase, Calendar, CheckCircle2, Loader2 } from "lucide-react";

const TYPE_ICONS: Record<string, any> = {
  PLOT: TreePine, HOUSE: Home, FLAT: Building2, COMMERCIAL: Briefcase,
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then(({ property }) => { setProperty(property); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center pt-16 text-slate-400">Property not found.</div>
  );

  const Icon = TYPE_ICONS[property.type] || Home;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 hero-gradient">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to search
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left col */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo gallery */}
            <div className="glass rounded-2xl overflow-hidden border border-white/5">
              <div className="h-72 sm:h-96 bg-slate-800/50 relative overflow-hidden">
                {property.photos?.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={property.photos[activePhoto]} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-24 h-24 text-slate-700" />
                  </div>
                )}
                {/* Status */}
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ● {property.status}
                </span>
                <button
                  onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
                  className="absolute top-4 right-4 p-2 rounded-xl glass text-slate-300 hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              {/* Thumbnails */}
              {property.photos?.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {property.photos.map((p: string, i: number) => (
                    <button key={i} onClick={() => setActivePhoto(i)} className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${i === activePhoto ? "border-emerald-500" : "border-transparent"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    {property.address}, {property.city}, {property.state} — {property.pincode}
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-slate-300">
                  <Icon className="w-3 h-3" />
                  {getPropertyTypeLabel(property.type)}
                </span>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-extrabold gradient-text-buyer">{formatPrice(property.price)}</div>
                  <div className="text-slate-500 text-xs mt-1">Asking Price</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                    {property.area_sqft.toLocaleString()}
                  </div>
                  <div className="text-slate-500 text-xs mt-1">sq.ft area</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold text-white">₹{Math.round(property.price_per_sqft).toLocaleString()}</div>
                  <div className="text-slate-500 text-xs mt-1">per sq.ft</div>
                </div>
              </div>

              {property.description && (
                <div>
                  <h2 className="text-slate-300 font-semibold mb-2">Description</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">{property.description}</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                Listed on {new Date(property.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Right col — Sidebar */}
          <div className="space-y-5">
            {/* Seller contact */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  {property.seller_name?.[0]}
                </div>
                <div>
                  <div className="text-white font-semibold">{property.seller_name}</div>
                  <div className="flex items-center gap-1 text-emerald-400 text-xs">
                    <CheckCircle2 className="w-3 h-3" /> Verified Seller
                  </div>
                </div>
              </div>

              {!showContact ? (
                <button
                  id="show-contact-btn"
                  onClick={() => setShowContact(true)}
                  className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Reveal Contact
                </button>
              ) : (
                <div className="space-y-3 fade-in">
                  <a href={`tel:${property.seller_phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15 transition-all">
                    <Phone className="w-4 h-4" />
                    <div>
                      <div className="text-xs text-slate-400">Phone</div>
                      <div className="font-semibold">{property.seller_phone}</div>
                    </div>
                  </a>
                  {property.seller_email && (
                    <a href={`mailto:${property.seller_email}`} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-500">Email</div>
                        <div className="text-sm text-slate-300">{property.seller_email}</div>
                      </div>
                    </a>
                  )}
                  <a
                    href={`https://wa.me/91${property.seller_phone}?text=Hi, I'm interested in your property: ${property.title}`}
                    target="_blank"
                    className="btn-seller w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    💬 WhatsApp Seller
                  </a>
                </div>
              )}
            </div>

            {/* AI Price estimate */}
            {property.ai_price_min && property.ai_price_max && (
              <PriceEstimate
                label={property.ai_label || "Fair Deal"}
                min={property.ai_price_min}
                max={property.ai_price_max}
                predicted={(property.ai_price_min + property.ai_price_max) / 2}
                pricePerSqft={((property.ai_price_min + property.ai_price_max) / 2) / property.area_sqft}
                askingPrice={property.price}
              />
            )}
            <EMICalculator defaultPrice={property.price} />
            {/* Location info */}
            <div className="glass rounded-xl p-4 border border-white/5">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Location</h3>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex justify-between"><span>City</span><span className="text-slate-300">{property.city}</span></div>
                <div className="flex justify-between"><span>State</span><span className="text-slate-300">{property.state}</span></div>
                <div className="flex justify-between"><span>Pincode</span><span className="text-slate-300">{property.pincode}</span></div>
                <div className="flex justify-between"><span>Coordinates</span><span className="text-slate-300">{property.lat.toFixed(4)}, {property.lng.toFixed(4)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
