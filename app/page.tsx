import Link from "next/link";
import { MapPin, TrendingUp, Shield, Search, ArrowRight, Home, Building2, TreePine, Briefcase } from "lucide-react";

const STATS = [
  { label: "Active Listings", value: "2,400+" },
  { label: "Cities Covered", value: "180+" },
  { label: "Happy Users", value: "12,000+" },
  { label: "Properties Sold", value: "800+" },
];

const FEATURES = [
  {
    icon: MapPin,
    title: "Pincode-based Search",
    desc: "Enter your pincode and instantly find all properties within a 20-30 km radius around you.",
    color: "from-emerald-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "AI Price Prediction",
    desc: "Our ML model estimates fair market price based on area, location tier, and nearby trends.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Shield,
    title: "Verified Sellers",
    desc: "Every seller is registered with a verified phone number. Contact directly, no middlemen.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Search,
    title: "Smart Filters",
    desc: "Filter by property type, price range, area size, and distance. Find exactly what you need.",
    color: "from-pink-500 to-rose-500",
  },
];

const PROPERTY_TYPES = [
  { icon: TreePine, label: "Plots & Land", count: "620+", color: "text-emerald-400" },
  { icon: Home, label: "Houses & Villas", count: "890+", color: "text-cyan-400" },
  { icon: Building2, label: "Flats & Apartments", count: "750+", color: "text-violet-400" },
  { icon: Briefcase, label: "Commercial", count: "140+", color: "text-amber-400" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-gradient pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            Hyperlocal · Real-time · AI-powered
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 fade-in" style={{ animationDelay: "0.1s" }}>
            Find Property{" "}
            <span className="gradient-text-buyer">Near You</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed fade-in" style={{ animationDelay: "0.2s" }}>
            India&apos;s first hyperlocal property platform. Search within{" "}
            <span className="text-emerald-400 font-semibold">20-30 km</span> of your pincode.
            Buy, sell or predict prices with AI — no broker, no commission.
          </p>

          {/* Mode cards */}
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto fade-in" style={{ animationDelay: "0.3s" }}>
            {/* Buyer card */}
            <Link href="/search" className="group glass rounded-2xl p-6 text-left hover:border-emerald-500/30 border border-white/0 transition-all card-hover glow-emerald">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">🏡 Buyer Mode</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Enter your pincode and explore all listings within 30 km. Filter by type, price, and area.
              </p>
              <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold group-hover:gap-3 transition-all">
                Search Properties <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Seller card */}
            <Link href="/seller/list-property" className="group glass rounded-2xl p-6 text-left hover:border-amber-500/30 border border-white/0 transition-all card-hover glow-amber">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">🏷️ Seller Mode</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                List your land or property for free. Get an AI price estimate and connect directly with local buyers.
              </p>
              <span className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold group-hover:gap-3 transition-all">
                List Your Property <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold gradient-text-buyer mb-1">{value}</div>
              <div className="text-slate-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Property Types ────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Browse by Type</h2>
            <p className="text-slate-500">From open land to ready-to-move apartments</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROPERTY_TYPES.map(({ icon: Icon, label, count, color }) => (
              <Link
                href={`/search?type=${label.split("&")[0].toUpperCase().trim().split(" ")[0]}`}
                key={label}
                className="glass rounded-xl p-5 text-center card-hover group"
              >
                <Icon className={`w-8 h-8 ${color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                <div className="text-white font-semibold text-sm mb-1">{label}</div>
                <div className="text-slate-500 text-xs">{count} listings</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Why PropLocal?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built specifically for India&apos;s local property market. No commissions. No middlemen. Just data.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass rounded-xl p-6 card-hover flex gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex-shrink-0 flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 border border-emerald-500/10 glow-emerald">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to find your <span className="gradient-text-buyer">dream property?</span>
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join 12,000+ users already buying and selling property locally on PropLocal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary px-8 py-3.5 text-base rounded-xl inline-flex items-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/search" className="px-8 py-3.5 text-base rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all inline-flex items-center gap-2">
              Browse Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-slate-600 text-sm">
        © 2024 PropLocal · Built for India&apos;s local property market · No commission, no broker
      </footer>
    </div>
  );
}
