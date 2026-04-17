import { cn, formatPrice } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PriceEstimateProps {
  label: string;
  min: number;
  max: number;
  predicted: number;
  pricePerSqft: number;
  askingPrice?: number;
  compact?: boolean;
}

export default function PriceEstimate({
  label, min, max, predicted, pricePerSqft, askingPrice, compact = false,
}: PriceEstimateProps) {
  const config = {
    "Fair Deal": {
      icon: Minus,
      badgeClass: "badge-fair",
      icon_class: "text-emerald-400",
      desc: "Priced close to market estimate",
    },
    "Overpriced": {
      icon: TrendingUp,
      badgeClass: "badge-over",
      icon_class: "text-red-400",
      desc: "Listed above market estimate",
    },
    "Underpriced": {
      icon: TrendingDown,
      badgeClass: "badge-under",
      icon_class: "text-amber-400",
      desc: "Listed below market estimate — great deal!",
    },
  }[label] ?? { icon: Minus, badgeClass: "badge-fair", icon_class: "text-slate-400", desc: "AI price estimate" };

  const Icon = config.icon;

  if (compact) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full", config.badgeClass)}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  }

  return (
    <div className="glass rounded-xl p-5 border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">AI Price Estimate</div>
            <div className="text-xs text-slate-500">Based on area, type &amp; local trends</div>
          </div>
        </div>
        <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5", config.badgeClass)}>
          <Icon className="w-3 h-3" /> {label}
        </span>
      </div>

      {/* Predicted price */}
      <div className="text-3xl font-extrabold text-white mb-1">{formatPrice(predicted)}</div>
      <div className="text-slate-500 text-sm mb-4">
        Estimated market price · ₹{Math.round(pricePerSqft).toLocaleString("en-IN")}/sq.ft
      </div>

      {/* Range bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>{formatPrice(min)}</span>
          <span>{formatPrice(max)}</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-30 rounded-full" />

          {/* Asking price marker */}
          {askingPrice && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-slate-900 shadow-lg"
              style={{ left: `${Math.min(100, Math.max(0, ((askingPrice - min) / (max - min)) * 100))}%` }}
              title={`Asking: ${formatPrice(askingPrice)}`}
            />
          )}

          {/* Predicted marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-lg"
            style={{ left: "50%" }}
            title={`Estimate: ${formatPrice(predicted)}`}
          />
        </div>
        <div className="text-xs text-slate-600 text-center mt-1">Fair price range (±15% confidence)</div>
      </div>

      <p className={cn("text-xs font-medium", config.icon_class)}>{config.desc}</p>
    </div>
  );
}
