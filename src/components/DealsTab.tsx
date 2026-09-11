import React, { useState } from 'react';
import { Coupon } from '../types';
import { Tag, Sparkles, Copy, Check, Percent, Gift, Flame, ArrowRight } from 'lucide-react';

interface DealsTabProps {
  coupons: Coupon[];
  onSelectCoupon?: (code: string) => void;
}

export const DealsTab: React.FC<DealsTabProps> = ({ coupons, onSelectCoupon }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [testAmount, setTestAmount] = useState<number>(10000);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Featured Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-4 text-white shadow-lg">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
            <Flame className="w-3 h-3 text-amber-300" />
            Seasonal Resort Vouchers
          </div>
          <h2 className="text-xl font-black tracking-tight">Grand Horizon Deals</h2>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xs">
            Save up to 15% on Luxury Oceanfront Plunge Pool Villas and VIP Videoke Cottages.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Active Coupons List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            Available Promotional Codes
          </h3>
          <span className="text-[11px] text-cyan-400 font-medium">
            {coupons.filter(c => c.status === 'Active').length} Active
          </span>
        </div>

        {coupons.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          const isPercent = coupon.discount_type === 'percentage';

          return (
            <div
              key={coupon.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm tracking-wider text-amber-300 bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                    {coupon.code}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400">
                    {isPercent ? `${coupon.discount_value}% OFF` : `₱${coupon.discount_value.toLocaleString()} OFF`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isPercent 
                    ? `Get ${coupon.discount_value}% discount on entire accommodation rate.` 
                    : `Direct ₱${coupon.discount_value.toLocaleString()} cash reduction at checkout.`}
                </p>
                <div className="text-[10px] text-slate-500">
                  Used: {coupon.times_used} {coupon.max_uses > 0 ? `/ ${coupon.max_uses} max` : ''}
                </div>
              </div>

              <button
                onClick={() => handleCopy(coupon.code)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Coupon Savings Calculator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Discount Savings Estimator
        </h4>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 block font-medium">
            Sample Booking Subtotal (₱):
          </label>
          <input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(Math.max(0, Number(e.target.value)))}
            step={500}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">With HORIZON2026 (15%)</span>
            <span className="text-emerald-400 font-bold text-sm">
              Save ₱{Math.round((testAmount * 15) / 100).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Pay: ₱{Math.max(0, testAmount - Math.round((testAmount * 15) / 100)).toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">With BEACHFUN500</span>
            <span className="text-emerald-400 font-bold text-sm">
              Save ₱{Math.min(testAmount, 500).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Pay: ₱{Math.max(0, testAmount - 500).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
