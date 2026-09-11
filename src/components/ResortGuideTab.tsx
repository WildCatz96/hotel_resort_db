import React, { useState } from 'react';
import { Settings } from '../types';
import { 
  Compass, 
  Clock, 
  MapPin, 
  Phone, 
  QrCode, 
  HelpCircle, 
  ShieldCheck, 
  Waves, 
  Sparkles, 
  Coffee, 
  Utensils, 
  Music, 
  Wifi, 
  Car, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ResortGuideTabProps {
  settings: Settings;
  onOpenBooking: () => void;
}

export const ResortGuideTab: React.FC<ResortGuideTabProps> = ({ settings, onOpenBooking }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showFullQr, setShowFullQr] = useState(false);

  const faqs = [
    {
      q: 'What is the standard check-in and check-out schedule?',
      a: `Standard check-in begins at 2:00 PM. Overnight accommodations check-out is at ${settings.checkout_time_overnight || '12:00 PM (Noon)'}, while Day-Use native cottages and cabanas check-out at ${settings.checkout_time_dayuse || '12:00 Midnight'}.`
    },
    {
      q: 'What is the 1-Hour Arrival Grace Period policy?',
      a: 'We automatically hold your reserved unit for 1 hour past your specified Estimated Time of Arrival (ETA). If you experience travel delays, you can easily tap "Request ETA Extension" inside the "Stays" tab of this app to keep your reservation secured.'
    },
    {
      q: 'How does the 50% Downpayment work?',
      a: 'You can secure your villa or cottage with just a 50% downpayment via GCash or Maya. The remaining 50% balance can be settled upon arrival at the resort front desk via cash or QR.'
    },
    {
      q: 'Is there a corkage fee for outside food or drinks?',
      a: 'Cooked meals, snacks, and personal beverages are free of corkage! Commercial catering, whole lechon, or alcoholic kegs require a nominal service fee of ₱300. Grilling stations are free for cottage and villa guests.'
    },
    {
      q: 'Are infinity pool and beach access included?',
      a: 'Yes! All guests staying in villas, suites, and cottages enjoy complimentary access to our oceanfront infinity pool (open 7:00 AM - 10:00 PM) and pristine white sand beachfront.'
    }
  ];

  return (
    <div className="space-y-4 pb-24 text-slate-100">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-sky-900 to-slate-900 p-5 border border-cyan-700/40 shadow-xl">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Guest Services & Resort Guide
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Grand Horizon Luxury Resort
          </h2>
          <p className="text-xs text-cyan-100/90 leading-relaxed max-w-sm">
            Everything you need for an unforgettable coastal getaway. Check schedules, resort amenities, contact front desk, or view payment QR.
          </p>
        </div>
        <div className="absolute right-0 -bottom-8 w-44 h-44 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Action Hotline Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href="tel:09178889999"
          className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between gap-2 hover:border-cyan-500/40 transition shadow-md group"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Front Desk Hotline</span>
            <span className="text-xs font-bold text-white font-mono">0917-888-9999</span>
          </div>
        </a>

        <button
          onClick={() => setShowFullQr(true)}
          className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between gap-2 hover:border-cyan-500/40 transition shadow-md text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/80 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Official Payment QR</span>
            <span className="text-xs font-bold text-amber-300">View GCash / Maya</span>
          </div>
        </button>
      </div>

      {/* Check-In & Check-Out Policy Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Resort Time Schedule & Policies</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Check-In Time</span>
            <div className="text-white font-bold text-sm">2:00 PM</div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Early check-in subject to unit availability upon arrival.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Overnight Check-Out</span>
            <div className="text-amber-300 font-bold text-sm">
              {settings.checkout_time_overnight || '12:00 PM (Noon)'}
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Day-Use Cottages check-out at {settings.checkout_time_dayuse || '12:00 Midnight'}.
            </p>
          </div>
        </div>

        <div className="p-2.5 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-[11px] text-cyan-200 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">1-Hour Arrival Grace Period:</strong> We preserve your booked accommodation for 1 full hour past your ETA. You can extend your ETA anytime inside this app!
          </div>
        </div>
      </div>

      {/* Resort Amenities & Highlights */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Waves className="w-3.5 h-3.5 text-cyan-400" />
          Guest Amenities & Inclusions
        </h3>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Infinity Pool Access</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Resort-wide Wi-Fi</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Car className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Free Secure Parking</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>BBQ Grilling Areas</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Music className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>VIP Videoke Lounges</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Coffee className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Buffet Breakfast Bar</span>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-3 text-left flex items-center justify-between gap-2 text-xs font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Resort Location & Directions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-md">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <MapPin className="w-4 h-4 text-rose-400" />
          <span>Location & Arrival Address</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Grand Horizon Luxury Resort & Beach Spa<br />
          Coastal Coastal Highway, Brgy. San Isidro, Beachfront Sector
        </p>

        <div className="flex gap-2 pt-1">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Open in Google Maps</span>
          </a>
          <button
            onClick={onOpenBooking}
            className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition"
          >
            Book a Stay Now
          </button>
        </div>
      </div>

      {/* Payment QR Modal */}
      {showFullQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-cyan-400" />
                Official Resort Payment QR
              </span>
              <button
                onClick={() => setShowFullQr(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-inner inline-block mx-auto">
              <img
                src={settings.payment_qr_url || 'https://api.qrserver.com/v1/create-qr-code/?data=GCASH-GRAND-HORIZON-RESORT-09178889999&size=300x300'}
                alt="Payment QR"
                className="w-48 h-48 object-contain mx-auto"
              />
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-white">{settings.payment_qr_name}</div>
              <div className="font-mono text-cyan-400 font-bold text-sm">{settings.payment_qr_number}</div>
              <p className="text-[10px] text-slate-400">
                Scan using GCash, Maya, or any QRPh compliant banking app for instant downpayment verification.
              </p>
            </div>

            <button
              onClick={() => setShowFullQr(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
