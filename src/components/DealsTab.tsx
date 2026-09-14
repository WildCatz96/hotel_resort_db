import React, { useState } from 'react';
import { Coupon } from '../types';
import { Tag, Sparkles, Copy, Check, Gift, Flame, ShieldCheck } from 'lucide-react';

interface DealsTabProps {
  coupons: Coupon[];
  onSelectCoupon?: (code: string) => void;
}

export const DealsTab: React.FC<DealsTabProps> = ({ coupons }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeCoupons = coupons.filter(c => c.status === 'Active');

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
            Resort Promotions & Vouchers
          </div>
          <h2 className="text-xl font-black tracking-tight">Official Guest Deals</h2>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xs">
            Exclusive discounts and seasonal promotions provided directly by Grand Horizon Luxury Resort.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Active Coupons List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            Active Vouchers
          </h3>
          <span className="text-[11px] text-cyan-400 font-medium">
            {activeCoupons.length} Available
          </span>
        </div>

        {activeCoupons.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
            <Gift className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="font-semibold text-white text-xs">No Active Vouchers Right Now</h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Any promotional codes or seasonal discount vouchers created in the resort admin panel will automatically appear here.
            </p>
          </div>
        ) : (
          activeCoupons.map((coupon) => {
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
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(coupon.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
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
          })
        )}
      </div>

      {/* Booking Assurance Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-white text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Direct Resort Guarantee
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Bookings made through this guest mobile portal are recorded directly in the official Grand Horizon database. No third-party agency markups or hidden fees.
        </p>
      </div>
    </div>
  );
};

