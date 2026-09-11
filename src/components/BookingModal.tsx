import React, { useState, useEffect } from 'react';
import { Room, Settings, Coupon, Reservation } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Coffee, 
  CreditCard, 
  QrCode, 
  Check, 
  AlertCircle, 
  Tag, 
  Copy, 
  Sparkles, 
  ChevronDown,
  ShieldAlert,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface BookingModalProps {
  room: Room | null;
  settings: Settings;
  onClose: () => void;
  onSubmit: (bookingData: any) => Promise<{ status: 'success' | 'error'; message: string; reservation?: Reservation }>;
  onValidateCoupon: (code: string) => { valid: boolean; coupon?: Coupon; message: string };
  onBookingSuccess: (reservation: Reservation) => void;
}

const ETA_OPTIONS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM (Noon)',
  '01:00 PM', '02:00 PM (Standard)', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  settings,
  onClose,
  onSubmit,
  onValidateCoupon,
  onBookingSuccess
}) => {
  if (!room) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const isDayEntrance = room.category === 'Beach Entrance';
  const isDayTable = room.category === 'Day Table';

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(isDayEntrance || isDayTable ? todayStr : tomorrowStr);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'50% Downpayment' | 'Full Payment (100%)'>('50% Downpayment');
  const [arrivalTime, setArrivalTime] = useState('02:00 PM (Standard)');
  const [guestName, setGuestName] = useState('');
  const [contact, setContact] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'E-Wallet' | 'Cash'>('E-Wallet');
  const [refNo, setRefNo] = useState('');
  
  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // QR Modal zoom
  const [showQrZoom, setShowQrZoom] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Calculate nights
  const calculateNights = () => {
    if (isDayEntrance || isDayTable) return 1;
    const cin = new Date(checkIn);
    const cout = new Date(checkOut);
    const diff = Math.ceil((cout.getTime() - cin.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, isNaN(diff) ? 1 : diff);
  };

  const nights = calculateNights();
  const totalGuests = Math.max(1, adults + children);

  // Calculations matching the backend PHP logic
  let basePrice = 0;
  let breakfastFee = 0;

  if (isDayEntrance) {
    basePrice = room.price * totalGuests * nights;
    breakfastFee = 0;
  } else {
    basePrice = room.price * nights;
    breakfastFee = hasBreakfast ? (250 * totalGuests * nights) : 0;
  }

  const subtotal = basePrice + breakfastFee;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discount_value) / 100);
    } else {
      discount = Math.min(subtotal, appliedCoupon.discount_value);
    }
  }

  const totalPrice = Math.max(0, subtotal - discount);
  const downpayment = paymentOption === 'Full Payment (100%)' ? totalPrice : Math.round(totalPrice / 2);
  const remainingBalance = totalPrice - downpayment;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const res = onValidateCoupon(couponInput.trim());
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponMessage({ type: 'success', text: res.message });
    } else {
      setAppliedCoupon(null);
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  const handleCopyNumber = () => {
    if (settings.payment_qr_number) {
      navigator.clipboard.writeText(settings.payment_qr_number);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (!guestName.trim()) {
      setErrorNotice('Please enter the primary guest name.');
      return;
    }
    if (!contact.trim()) {
      setErrorNotice('Please provide a mobile contact number.');
      return;
    }
    if (paymentMethod === 'E-Wallet' && !refNo.trim()) {
      setErrorNotice('Please enter the GCash/Maya transaction reference number for verification.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onSubmit({
        room_id: room.id,
        check_in: checkIn,
        check_out: checkOut,
        guest_name: guestName.trim(),
        contact: contact.trim(),
        payment_method: paymentMethod,
        ref_no: refNo.trim(),
        arrival_time: arrivalTime,
        payment_option: paymentOption,
        guests_adults: adults,
        guests_children: children,
        has_breakfast: hasBreakfast,
        coupon_code: appliedCoupon?.code || ''
      });

      if (res.status === 'success' && res.reservation) {
        onBookingSuccess(res.reservation);
        onClose();
      } else {
        setErrorNotice(res.message || 'Failed to submit reservation. Please check fields.');
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Booking submission error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      {/* Android Bottom Sheet Container */}
      <div className="w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Android Sheet Top Drag Handle */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
              New Reservation
            </div>
            <h3 className="text-base font-bold text-white truncate max-w-[280px]">
              {room.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-4 py-3 space-y-4 text-xs">
          {errorNotice && (
            <div className="flex items-start gap-2 p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Dates & Duration */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Stay Schedule
              </span>
              <span className="text-[11px] text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                {nights} {nights === 1 ? 'Night' : 'Nights'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-medium">Check-In Date</label>
                <input
                  type="date"
                  value={checkIn}
                  min={todayStr}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (new Date(e.target.value) >= new Date(checkOut)) {
                      const next = new Date(new Date(e.target.value).getTime() + 86400000).toISOString().split('T')[0];
                      setCheckOut(next);
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-medium">Check-Out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  disabled={isDayEntrance || isDayTable}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Arrival Time (ETA) dropdown with 1-hour policy */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Estimated Arrival Time (ETA)
                </label>
                <span className="text-[10px] text-cyan-400">Strict 1-hr Grace Period</span>
              </div>
              <select
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
              >
                {ETA_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                Policy: If late by over 1 hour past ETA, room will auto-release unless an ETA Extension is logged.
              </p>
            </div>
          </div>

          {/* Guests and Breakfast */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-3">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Guests & Add-ons
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                <span className="text-slate-300">Adults</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="text-white font-bold w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                <span className="text-slate-300">Kids</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="text-white font-bold w-4 text-center">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Breakfast Toggle (not applicable for beach pass) */}
            {!isDayEntrance && (
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-800/80 transition">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-white font-medium">Add Gourmet Breakfast Buffet</div>
                    <div className="text-[10px] text-slate-400">₱250 per guest / night</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasBreakfast}
                  onChange={(e) => setHasBreakfast(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-600 bg-slate-800 border-slate-700 focus:ring-cyan-500"
                />
              </label>
            )}
          </div>

          {/* Guest Contact Information */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-2.5">
            <span className="font-semibold text-slate-200 text-xs">Primary Guest Details</span>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Maria Clara Santos"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-medium">Mobile Number (SMS Updates)</label>
              <input
                type="tel"
                placeholder="e.g. 0917-123-4567"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Promo Coupon Section */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              Promo Coupon Discount
            </span>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. HORIZON2026, WELCOME10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 uppercase tracking-wider"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 transition"
              >
                Apply
              </button>
            </div>

            {couponMessage && (
              <p className={`text-[11px] ${couponMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Payment Options (50% Downpayment vs Full Payment) */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-2.5">
            <span className="font-semibold text-slate-200 text-xs">Payment Settlement Option</span>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentOption('50% Downpayment')}
                className={`p-2.5 rounded-xl text-left border transition ${
                  paymentOption === '50% Downpayment'
                    ? 'bg-cyan-950/50 border-cyan-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-xs">50% Downpayment</div>
                <div className="text-[10px] text-cyan-400 mt-0.5">Pay remaining at Check-In</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentOption('Full Payment (100%)')}
                className={`p-2.5 rounded-xl text-left border transition ${
                  paymentOption === 'Full Payment (100%)'
                    ? 'bg-cyan-950/50 border-cyan-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-xs">Full Payment (100%)</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Expedited Check-In</div>
              </button>
            </div>

            {/* Official E-Wallet QR Code */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                    Official {settings.payment_qr_provider || 'GCash / Maya'}
                  </div>
                  <div className="text-[10px] text-slate-400">Account: {settings.payment_qr_name}</div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 bg-cyan-950/50 border border-cyan-800 px-2 py-1 rounded-lg hover:bg-cyan-900/50"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedNumber ? 'Copied!' : settings.payment_qr_number}</span>
                </button>
              </div>

              {/* QR Image Preview */}
              <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <img
                  src={settings.payment_qr_url || 'https://api.qrserver.com/v1/create-qr-code/?data=GCASH-GRAND-HORIZON-RESORT&size=200x200'}
                  alt="Payment QR"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded bg-white p-1 object-contain"
                />
                <div className="flex-1 text-[11px] text-slate-300">
                  <p>Scan using GCash, Maya, or any InstaPay app.</p>
                  <p className="text-amber-300 font-bold mt-0.5">
                    Amount to Send: ₱{downpayment.toLocaleString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowQrZoom(true)}
                    className="inline-flex items-center gap-1 text-[10px] text-cyan-400 mt-1 hover:underline"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Tap to enlarge QR
                  </button>
                </div>
              </div>

              {/* Reference Number Input */}
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-medium">
                  Payment Reference / Trace Number (Required for confirmation)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9024 1120 4881"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing Calculation Summary Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-1.5 text-slate-300">
            <div className="font-semibold text-white text-xs border-b border-slate-800 pb-1 mb-1">
              Billing Breakdown
            </div>
            
            <div className="flex justify-between text-[11px]">
              <span>Base Accommodation ({nights} {nights === 1 ? 'night' : 'nights'})</span>
              <span>₱{basePrice.toLocaleString()}</span>
            </div>

            {hasBreakfast && (
              <div className="flex justify-between text-[11px]">
                <span>Breakfast Buffet ({totalGuests} guests x {nights}d)</span>
                <span>₱{breakfastFee.toLocaleString()}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between text-[11px] text-emerald-400 font-medium">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>-₱{discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-xs font-bold text-white pt-1 border-t border-slate-800">
              <span>Grand Total</span>
              <span>₱{totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-xs font-extrabold text-amber-300 pt-1">
              <span>Required Downpayment Due Now</span>
              <span>₱{downpayment.toLocaleString()}</span>
            </div>

            {remainingBalance > 0 && (
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Remaining Balance upon Arrival</span>
                <span>₱{remainingBalance.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Checkout and Policy Disclaimer */}
          <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200/90 text-[10px] space-y-1">
            <div className="font-bold flex items-center gap-1 text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              Resort Guest Policies:
            </div>
            <p>• Check-out time is strictly <strong>{settings.checkout_time_overnight || '12:00 PM (Noon)'}</strong> for overnight stays, and <strong>{settings.checkout_time_dayuse || '12:00 Midnight'}</strong> for day-use cottages.</p>
            <p>• Late Arrival: Bookings are held for up to 1 HOUR past your ETA. You can request an ETA extension directly in the app.</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting Booking...</span>
            ) : (
              <>
                <span>Confirm & Reserve Room</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* QR Zoom Modal */}
      {showQrZoom && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowQrZoom(false)}
        >
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl max-w-xs w-full text-center space-y-3" onClick={e => e.stopPropagation()}>
            <h4 className="font-bold text-white text-sm">{settings.payment_qr_provider} Official QR</h4>
            <div className="bg-white p-3 rounded-2xl inline-block shadow-xl">
              <img
                src={settings.payment_qr_url}
                alt="Enlarged QR"
                className="w-56 h-56 object-contain"
              />
            </div>
            <p className="text-xs text-slate-300 font-mono font-bold">{settings.payment_qr_number}</p>
            <p className="text-[11px] text-slate-400">{settings.payment_qr_name}</p>
            <button
              onClick={() => setShowQrZoom(false)}
              className="w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
