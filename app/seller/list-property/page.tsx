"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload, MapPin, Home, TrendingUp, CheckCircle } from "lucide-react";


const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  type: z.enum(["PLOT", "HOUSE", "FLAT", "COMMERCIAL"]),
  area_sqft: z.string().min(1, "Enter area").refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Area must be a positive number"),
  price: z.string().min(1, "Enter price").refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Price must be a positive number"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  address: z.string().min(5, "Enter a complete address"),
  seller_name: z.string().min(2, "Enter your name"),
  seller_phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone"),
  seller_email: z.string().email().optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function ListPropertyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [photos] = useState<string[]>([]); // Cloudinary URLs would be added here

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "HOUSE",
      seller_name: session?.user?.name || "",
    },
  });

  const watchedArea = watch("area_sqft");
  const watchedPrice = watch("price");
  const pricePerSqft =
    watchedArea && watchedPrice
      ? Math.round(parseFloat(watchedPrice as unknown as string) / parseFloat(watchedArea as unknown as string))
      : null;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          area_sqft: parseFloat(data.area_sqft as unknown as string),
          price: parseFloat(data.price as unknown as string),
          photos,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Failed to list property"); setLoading(false); return; }
      setSuccess(true);
      setTimeout(() => router.push("/seller/dashboard"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 text-center px-4">
        <div>
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-white mb-3">Sign in to list your property</h2>
          <a href="/login" className="btn-primary px-6 py-3 rounded-xl inline-block text-sm">Sign in</a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 text-center px-4">
        <div className="glass rounded-2xl p-10 max-w-sm fade-in">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Property Listed!</h2>
          <p className="text-slate-400">Your property is now live. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-red-400 text-xs mt-1">{msg}</p> : null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 seller-gradient">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 shadow-lg mb-4">
            <Home className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">List Your Property</h1>
          <p className="text-slate-400">Fill in the details below. We&apos;ll auto-calculate the AI price estimate.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">1</span>
              Property Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Property Title *</label>
                <input {...register("title")} id="prop-title" placeholder="e.g. 2000 sqft Residential Plot in Kothrud" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                <FieldError msg={errors.title?.message} />
              </div>

              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Property Type *</label>
                <select {...register("type")} id="prop-type" className="input-dark w-full px-4 py-3 rounded-xl text-sm">
                  <option value="PLOT">🌳 Plot / Land</option>
                  <option value="HOUSE">🏠 House / Villa</option>
                  <option value="FLAT">🏢 Flat / Apartment</option>
                  <option value="COMMERCIAL">🏪 Commercial</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Description</label>
                <textarea {...register("description")} rows={3} placeholder="Describe the property — location highlights, nearby landmarks, etc." className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" />
              </div>
            </div>
          </div>

          {/* Pricing & Area */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">2</span>
              Size &amp; Pricing
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Area (sq.ft) *</label>
                <input {...register("area_sqft")} id="prop-area" type="number" placeholder="e.g. 1200" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                <FieldError msg={errors.area_sqft?.message} />
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Asking Price (₹) *</label>
                <input {...register("price")} id="prop-price" type="number" placeholder="e.g. 5000000" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                <FieldError msg={errors.price?.message} />
              </div>
            </div>

            {pricePerSqft && (
              <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                <TrendingUp className="w-4 h-4" />
                ₹{pricePerSqft.toLocaleString("en-IN")} per sq.ft
              </div>
            )}
          </div>

          {/* Location */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">3</span>
              Location
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-1.5">Pincode *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register("pincode")} id="prop-pincode" maxLength={6} placeholder="6-digit pincode" className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm" />
                  </div>
                  <FieldError msg={errors.pincode?.message} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Full Address *</label>
                <input {...register("address")} id="prop-address" placeholder="Street, locality, area name" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                <FieldError msg={errors.address?.message} />
              </div>
            </div>
          </div>

          {/* Photos placeholder */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">4</span>
              Photos
            </h2>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Click to upload property photos</p>
              <p className="text-slate-600 text-xs mt-1">PNG, JPG up to 10MB each (max 5 photos)</p>
              <p className="text-amber-400/60 text-xs mt-2">Cloudinary integration — add CLOUDINARY keys to .env.local</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">5</span>
              Your Contact Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-1.5">Your Name *</label>
                  <input {...register("seller_name")} id="seller-name" placeholder="Full name" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                  <FieldError msg={errors.seller_name?.message} />
                </div>
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-1.5">Phone Number *</label>
                  <input {...register("seller_phone")} id="seller-phone" type="tel" maxLength={10} placeholder="10-digit number" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                  <FieldError msg={errors.seller_phone?.message} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Email (optional)</label>
                <input {...register("seller_email")} id="seller-email" type="email" placeholder="your@email.com" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                <FieldError msg={errors.seller_email?.message} />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            id="list-property-submit"
            className="btn-seller w-full py-4 rounded-xl text-base flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "🚀 List Property & Get AI Estimate"}
          </button>
        </form>
      </div>
    </div>
  );
}
