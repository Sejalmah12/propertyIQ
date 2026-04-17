"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatPrice, formatArea, getPropertyTypeLabel, getStatusColor } from "@/lib/utils";
import { PlusCircle, Edit, Trash2, Eye, TrendingUp, Loader2, Home, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";


export default function SellerDashboard() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/listings?sellerId=${session.user.id}`)
      .then((r) => r.json())
      .then(({ listings }) => { setListings(listings || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setDeletingId(id);
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setListings((prev) => prev.filter((l) => l.id !== id));
    setDeletingId(null);
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 text-center px-4">
        <div>
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-white mb-3">Sign in to view your dashboard</h2>
          <Link href="/login" className="btn-primary px-6 py-3 rounded-xl inline-block text-sm">Sign in</Link>
        </div>
      </div>
    );
  }

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "ACTIVE").length,
    sold: listings.filter((l) => l.status === "SOLD").length,
    totalValue: listings.reduce((s, l) => s + l.price, 0),
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 seller-gradient">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Seller Dashboard</h1>
            <p className="text-slate-400">Welcome back, <span className="text-white font-medium">{session?.user?.name}</span></p>
          </div>
          <Link href="/seller/list-property" className="btn-seller px-5 py-3 rounded-xl text-sm flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> New Listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Listings", value: stats.total, color: "from-slate-700 to-slate-600" },
            { label: "Active", value: stats.active, color: "from-emerald-600 to-cyan-600" },
            { label: "Sold", value: stats.sold, color: "from-amber-600 to-orange-600" },
            { label: "Total Value", value: formatPrice(stats.totalValue), color: "from-violet-600 to-purple-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass rounded-xl p-4 border border-white/5">
              <div className={`text-2xl font-extrabold bg-gradient-to-br ${color} bg-clip-text text-transparent mb-1`}>{value}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Listings */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center border border-white/5">
            <Home className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No listings yet</h2>
            <p className="text-slate-400 mb-6 text-sm">List your first property and reach local buyers within 30 km.</p>
            <Link href="/seller/list-property" className="btn-seller px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> List Your First Property
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="glass rounded-2xl p-5 border border-white/5 hover:border-amber-500/20 transition-all">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  <div className="w-20 h-20 rounded-xl bg-slate-800/50 overflow-hidden flex-shrink-0">
                    {listing.photos?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={listing.photos[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-8 h-8 text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="text-white font-semibold line-clamp-1">{listing.title}</h3>
                        <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                          <MapPin className="w-3 h-3" /> {listing.city}, {listing.pincode}
                        </div>
                      </div>
                      <span className={cn("text-xs font-bold", getStatusColor(listing.status))}>● {listing.status}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <div className="text-lg font-extrabold gradient-text-seller">{formatPrice(listing.price)}</div>
                      <div className="text-slate-500 text-xs">{formatArea(listing.area_sqft)}</div>
                      <div className="text-slate-500 text-xs">{getPropertyTypeLabel(listing.type)}</div>
                      {listing.ai_label && (
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                          listing.ai_label === "Fair Deal" ? "badge-fair" : listing.ai_label === "Overpriced" ? "badge-over" : "badge-under"
                        )}>
                          <TrendingUp className="w-3 h-3 inline mr-1" />{listing.ai_label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/listing/${listing.id}`} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all" title="View">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleStatusToggle(listing.id, listing.status)}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all text-xs"
                      title={listing.status === "ACTIVE" ? "Pause listing" : "Activate listing"}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete"
                    >
                      {deletingId === listing.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
