import { cn, formatPrice, formatArea, formatDistance } from "@/lib/utils";
import { MapPin, Maximize2, Home, Building2, TreePine, Briefcase, TrendingUp, Phone } from "lucide-react";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  type: string;
  area_sqft: number;
  price: number;
  price_per_sqft: number;
  pincode: string;
  city: string;
  state: string;
  address: string;
  photos: string[];
  seller_name: string;
  seller_phone: string;
  status: string;
  ai_price_min?: number | null;
  ai_price_max?: number | null;
  ai_label?: string | null;
  distance_m?: number;
  createdAt: string;
}

const TYPE_ICONS: Record<string, any> = {
  PLOT: TreePine,
  HOUSE: Home,
  FLAT: Building2,
  COMMERCIAL: Briefcase,
};

const TYPE_COLORS: Record<string, string> = {
  PLOT: "text-emerald-400 bg-emerald-400/10",
  HOUSE: "text-cyan-400 bg-cyan-400/10",
  FLAT: "text-violet-400 bg-violet-400/10",
  COMMERCIAL: "text-amber-400 bg-amber-400/10",
};

const LABEL_CLASS: Record<string, string> = {
  "Fair Deal": "badge-fair",
  "Overpriced": "badge-over",
  "Underpriced": "badge-under",
};

export default function ListingCard({ property }: { property: Property }) {
  const Icon = TYPE_ICONS[property.type] || Home;
  const typeColor = TYPE_COLORS[property.type] || "text-slate-400 bg-slate-400/10";
  const photo = property.photos?.[0];

  return (
    <Link href={`/listing/${property.id}`} className="block group">
      <div className="glass rounded-2xl overflow-hidden card-hover border border-white/5 hover:border-emerald-500/20 transition-all h-full">
        {/* Photo */}
        <div className="relative h-44 bg-slate-800/50 overflow-hidden">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon className={`w-14 h-14 ${typeColor.split(" ")[0]} opacity-20`} />
            </div>
          )}

          {/* Type badge */}
          <span className={cn("absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5", typeColor)}>
            <Icon className="w-3 h-3" />
            {property.type.charAt(0) + property.type.slice(1).toLowerCase()}
          </span>

          {/* AI label */}
          {property.ai_label && (
            <span className={cn("absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full", LABEL_CLASS[property.ai_label] || "badge-fair")}>
              {property.ai_label}
            </span>
          )}

          {/* Distance */}
          {property.distance_m !== undefined && (
            <span className="absolute bottom-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full glass text-slate-300">
              {formatDistance(property.distance_m)} away
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-base mb-1 line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{property.city}, {property.state} · {property.pincode}</span>
          </div>

          {/* Price */}
          <div className="mb-3">
            <div className="text-2xl font-extrabold gradient-text-buyer">{formatPrice(property.price)}</div>
            <div className="text-slate-500 text-xs mt-0.5">₹{Math.round(property.price_per_sqft).toLocaleString("en-IN")}/sq.ft</div>
          </div>

          {/* Area + AI range */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Maximize2 className="w-3 h-3" />
              {formatArea(property.area_sqft)}
            </div>
            {property.ai_price_min && property.ai_price_max && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <TrendingUp className="w-3 h-3" />
                Est. {formatPrice(property.ai_price_min)}–{formatPrice(property.ai_price_max)}
              </div>
            )}
          </div>

          {/* Seller */}
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Listed by <span className="text-slate-300">{property.seller_name}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <Phone className="w-3 h-3" /> Contact
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
