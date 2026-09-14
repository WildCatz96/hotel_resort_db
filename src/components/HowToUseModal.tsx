import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  Calendar, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Lock,
  Search,
  Coffee,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

interface HowToUseModalProps {
  onClose: () => void;
}

const INSTRUCTION_STEPS = [
  {
    id: 1,
    title: '1. Browse & Choose Stays',
    subtitle: 'Villas, Native Cottages & Day Passes',
    icon: Compass,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    highlight: 'Filter by category and check real-time availability.',
    points: [
      {
        bold: 'Explore Accommodations:',
        desc: 'Browse Luxury Beachfront Villas, Air-Conditioned Cottages with Videoke, Open Native Cottages, or Day Pool Passes.'
      },
      {
        bold: 'View Photos & Amenities:',
        desc: 'Tap "View Details" to see high-resolution photos, maximum guest capacity, bed configurations, and free amenities.'
      },
      {
        bold: 'Real-Time Availability:',
        desc: 'Units are linked live to the resort system. If all units are taken, the card will display "Fully Booked".'
      }
    ]
  },
  {
    id: 2,
    title: '2. Customize Your Dates',
    subtitle: 'Guest Counts, Breakfast & Promos',
    icon: Calendar,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    highlight: 'Tap "Book Now" on any available accommodation.',
    points: [
      {
        bold: 'Check-In & Check-Out:',
        desc: 'Select your arrival and departure dates. The app calculates the total nights automatically.'
      },
      {
        bold: 'Guests & Breakfast Buffet:',
        desc: 'Enter the number of adults and children. Optionally add the daily Breakfast Buffet (₱350/guest).'
      },
      {
        bold: 'Discount Coupons:',
        desc: 'Check the "Deals" tab for active promo codes (e.g. HORIZON2026 for 15% OFF) and apply them for instant savings.'
      }
    ]
  },
  {
    id: 3,
    title: '3. Pay Downpayment via QR',
    subtitle: 'GCash & Maya Instant Verification',
    icon: QrCode,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    highlight: 'Choose 50% Downpayment or Full Payment.',
    points: [
      {
        bold: 'Scan Resort QR Code:',
        desc: 'The official Grand Horizon GCash / Maya QR code is displayed right on the payment screen.'
      },
      {
        bold: 'Submit Reference Number:',
        desc: 'Send your payment through your GCash/Maya app and copy the 13-digit Reference Number (e.g. 100234567891).'
      },
      {
        bold: 'Immediate Database Saving:',
        desc: 'Your reservation is saved instantly into the resort database and assigned a unique reference code (e.g. RES-841).'
      }
    ]
  },
  {
    id: 4,
    title: '4. Private Stays & Arrival',
    subtitle: 'Guest Privacy & Front Desk Check-in',
    icon: Lock,
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    highlight: 'Only you can see your bookings on this device.',
    points: [
      {
        bold: 'Private Guest Portal:',
        desc: 'Other users cannot see your reservations, personal names, or contact details. Your bookings stay private on your device.'
      },
      {
        bold: 'Track & Present Code:',
        desc: 'Go to the "Stays" tab to view your active booking and digital boarding pass. Show your code (e.g. RES-841) at the front desk.'
      },
      {
        bold: 'Running Late? Extend ETA:',
        desc: 'If stuck in traffic, tap "Extend ETA" to notify the staff so your room won\'t be released to walk-in guests.'
      },
      {
        bold: 'Booked on Another Device?',
        desc: 'Use the "Link Reservation" search box in the Stays tab with your reference code to view it here anytime.'
      }
    ]
  },
  {
    id: 5,
    title: '5. Resort Rules & Services',
    subtitle: 'Policies, Wi-Fi & Support',
    icon: HelpCircle,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    highlight: 'Everything you need for a smooth holiday.',
    points: [
      {
        bold: 'Standard Times:',
        desc: 'Check-in is 2:00 PM; Check-out is 12:00 PM for overnight rooms. Day use is 8:00 AM to 5:00 PM.'
      },
      {
        bold: 'Wi-Fi & Amenities:',
        desc: 'High-speed fiber Wi-Fi is available across all beachfront villas, cottages, and the clubhouse.'
      },
      {
        bold: 'Need Help?',
        desc: 'Tap the "Guide" tab anytime to view front desk contact numbers, corkage policies, and resort amenities.'
      }
    ]
  }
];

export const HowToUseModal: React.FC<HowToUseModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const step = INSTRUCTION_STEPS[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < INSTRUCTION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">How to Use the App</h3>
              <p className="text-[11px] text-slate-400">Grand Horizon Guest Portal Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Chips */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800/60 flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none">
          {INSTRUCTION_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 min-w-[54px] py-1 px-2 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                currentStep === idx
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : currentStep > idx
                  ? 'bg-slate-800 text-cyan-400'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Step {idx + 1}</span>
              {currentStep > idx && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
            </button>
          ))}
        </div>

        {/* Modal Body: Active Step */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Card Hero */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl border ${step.badgeColor} shrink-0`}>
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-slate-800 text-slate-300 mb-1 border border-slate-700">
                Step {currentStep + 1} of {INSTRUCTION_STEPS.length}
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">{step.title}</h4>
              <p className="text-xs text-cyan-300 font-medium mt-0.5">{step.subtitle}</p>
            </div>
          </div>

          {/* Highlight Callout */}
          <div className="px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-xs text-cyan-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="leading-snug">{step.highlight}</span>
          </div>

          {/* Detailed Points */}
          <div className="space-y-3">
            {step.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-3 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  {i + 1}
                </div>
                <div className="leading-relaxed">
                  <span className="font-semibold text-white">{pt.bold} </span>
                  <span className="text-slate-300">{pt.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              currentStep === 0
                ? 'text-slate-600 bg-slate-800/40 cursor-not-allowed'
                : 'text-slate-300 bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 hover:from-cyan-400 hover:to-sky-400 shadow-md shadow-cyan-950 transition active:scale-[0.98]"
          >
            {currentStep === INSTRUCTION_STEPS.length - 1 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Got It! Start Exploring</span>
              </>
            ) : (
              <>
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
