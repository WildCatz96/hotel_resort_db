import React, { useState } from 'react';
import { Reservation, Settings } from '../types';
import { 
  Search, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Phone, 
  QrCode, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  User,
  Coffee,
  X,
  Lock,
  Plus,
  HelpCircle,
  Compass,
  Trash2
} from 'lucide-react';

interface ReservationsTabProps {
  reservations: Reservation[];
  settings: Settings;
  onExtendEta: (code: string, newEta: string, note: string) => Promise<boolean>;
  onClaimBooking?: (code: string) => { success: boolean; message: string; reservation?: Reservation };
  onRemoveBooking?: (code: string) => void;
  onNavigateExplore?: () => void;
  onOpenInstructions?: () => void;
}

export const ReservationsTab: React.FC<ReservationsTabProps> = ({
  reservations,
  settings,
  onExtendEta,
  onClaimBooking,
  onRemoveBooking,
  onNavigateExplore,
  onOpenInstructions
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [selectedPass, setSelectedPass] = useState<Reservation | null>(null);
  const [extendModalRes, setExtendModalRes] = useState<Reservation | null>(null);
  const [newEtaTime, setNewEtaTime] = useState('04:00 PM');
  const [etaNote, setEtaNote] = useState('Encountered heavy traffic along coastal highway');
  const [isExtending, setIsExtending] = useState(false);

  // Link reservation state
  const [linkInputCode, setLinkInputCode] = useState('');
  const [linkFeedback, setLinkFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);

  const filteredReservations = reservations.filter(res => {
    if (!searchCode.trim()) return true;
    const query = searchCode.toLowerCase().trim();
    return (
      res.code.toLowerCase().includes(query) ||
      res.guest_name.toLowerCase().includes(query) ||
      res.contact.includes(query) ||
      res.room_title.toLowerCase().includes(query)
    );
  });

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInputCode.trim() || !onClaimBooking) return;
    const result = onClaimBooking(linkInputCode.trim());
    if (result.success) {
      setLinkFeedback({ type: 'success', message: result.message });
      setLinkInputCode('');
      setShowLinkForm(false);
      setTimeout(() => setLinkFeedback(null), 4000);
    } else {
      setLinkFeedback({ type: 'error', message: result.message });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '1st Confirmed (Awaiting Arrival)':
        return {
          bg: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
          dot: 'bg-sky-400',
          label: '1st Confirmed (Awaiting Arrival)'
        };
      case '2nd Confirmed (Checked-In & Fully Paid)':
        return {
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
          label: 'Checked-In & Fully Paid'
        };
      case 'Pending 1st Confirmation':
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400 animate-pulse',
          label: 'Pending DP Verification'
        };
      case 'Expired (Auto No-Show)':
        return {
          bg: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-400',
          label: 'Expired (Auto No-Show)'
        };
      case 'Rejected':
        return {
          bg: 'bg-slate-800 text-slate-400 border-slate-700',
          dot: 'bg-slate-500',
          label: 'Reservation Declined'
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          dot: 'bg-slate-400',
          label: status
        };
    }
  };

  const handleConfirmExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendModalRes) return;
    setIsExtending(true);
    await onExtendEta(extendModalRes.code, newEtaTime, etaNote);
    setIsExtending(false);
    setExtendModalRes(null);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/60 text-cyan-300 text-[10px] font-semibold tracking-wide uppercase mb-1">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Private Guest Stays</span>
            </div>
            <h2 className="text-base font-bold text-white leading-tight">My Reservations</h2>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Bookings are kept private to this device. Other guests cannot see your stays.
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenInstructions && (
              <button
                onClick={onOpenInstructions}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                title="How to Use Guide"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
              </button>
            )}
            <button
              onClick={() => setShowLinkForm(!showLinkForm)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-950 border border-cyan-700/60 text-cyan-300 text-xs font-semibold hover:bg-cyan-900 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Link Code</span>
            </button>
          </div>
        </div>

        {/* Link Booking Accordion / Form */}
        {showLinkForm && (
          <form onSubmit={handleLinkSubmit} className="bg-slate-950 p-3 rounded-xl border border-cyan-500/30 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                Link an Existing Reservation
              </span>
              <button
                type="button"
                onClick={() => setShowLinkForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Booked through the website or another phone? Enter your booking reference code to view it here.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={linkInputCode}
                onChange={(e) => setLinkInputCode(e.target.value)}
                placeholder="e.g. RES-841"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono uppercase focus:outline-none focus:border-cyan-400"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition shrink-0"
              >
                Find & Link
              </button>
            </div>
          </form>
        )}

        {/* Link Feedback Toast */}
        {linkFeedback && (
          <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
            linkFeedback.type === 'success' 
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
          }`}>
            {linkFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="leading-tight">{linkFeedback.message}</span>
          </div>
        )}

        {/* Search Field if has bookings */}
        {reservations.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Search your stays by code (e.g. RES-841) or room..."
              className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500 font-mono uppercase"
            />
            {searchCode && (
              <button
                onClick={() => setSearchCode('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reservation List */}
      <div className="space-y-3">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">No Stays on This Device</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Your reservations are kept strictly private. Only bookings you make on this phone will appear here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              {onNavigateExplore && (
                <button
                  onClick={onNavigateExplore}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold text-xs shadow-md transition hover:brightness-110"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Rooms & Cottages</span>
                </button>
              )}
              <button
                onClick={() => setShowLinkForm(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 hover:bg-slate-700 transition"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Link Past Booking Code</span>
              </button>
            </div>
          </div>
        ) : (
          filteredReservations.map((res) => {
            const badge = getStatusBadge(res.status);
            const isAwaitingArrival = res.status === '1st Confirmed (Awaiting Arrival)';

            return (
              <div
                key={res.code}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md hover:border-slate-700 transition relative"
              >
                {/* Header Row: Code + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-cyan-400">
                        {res.code}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(res.created_at).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">
                        <Lock className="w-2.5 h-2.5 text-cyan-400" />
                        Private
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm mt-0.5">
                      {res.room_title}
                    </h3>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{res.guest_name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{res.contact}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{res.check_in} ({res.nights}n)</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>ETA: {res.arrival_time}</span>
                  </div>
                </div>

                {/* Grace Period & ETA Status Notice */}
                {isAwaitingArrival && (
                  <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-sky-300 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        Arrival Window: {res.arrival_time}
                      </span>
                      {res.eta_extended === 1 ? (
                        <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          ETA Extended
                        </span>
                      ) : (
                        <button
                          onClick={() => setExtendModalRes(res)}
                          className="text-[10px] text-amber-300 hover:text-amber-200 underline font-semibold"
                        >
                          Running late? Extend ETA
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-sky-200/80">
                      Resort policy: Your room is reserved until 1 hour past ETA. 
                      {res.eta_note ? ` Note: "${res.eta_note}"` : ''}
                    </p>
                  </div>
                )}

                {/* Rejection Notice */}
                {res.status === 'Rejected' && res.rejection_reason && (
                  <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-[11px]">
                    <strong>Decline Reason:</strong> {res.rejection_reason}
                  </div>
                )}

                {/* Billing Summary Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Rate</span>
                    <span className="font-bold text-white">₱{res.total_price.toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Paid (DP)</span>
                    <span className="font-bold text-emerald-400">₱{res.downpayment_amount.toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Balance at Desk</span>
                    <span className="font-bold text-amber-300">
                      {res.remaining_balance > 0 ? `₱${res.remaining_balance.toLocaleString()}` : 'Settled (₱0)'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {onRemoveBooking && (
                      <button
                        onClick={() => onRemoveBooking(res.code)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 transition"
                        title="Unlink stay from this device"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Digital Boarding Pass Button */}
                    <button
                      onClick={() => setSelectedPass(res)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Digital Boarding Pass Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Pass Top Banner */}
            <div className="bg-gradient-to-r from-cyan-900 to-sky-900 p-4 text-white relative">
              <button
                onClick={() => setSelectedPass(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                Grand Horizon Luxury Resort
              </div>
              <h3 className="text-lg font-extrabold mt-0.5">Guest Digital Pass</h3>
              <div className="font-mono text-xs text-sky-200 mt-1">
                Ref Code: <span className="text-white font-bold">{selectedPass.code}</span>
              </div>
            </div>

            {/* Pass Body */}
            <div className="p-4 space-y-3 text-xs">
              <div className="flex justify-center py-2 bg-white rounded-2xl shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=GRAND-HORIZON-${selectedPass.code}&size=160x160`}
                  alt="Pass QR"
                  className="w-36 h-36"
                />
              </div>

              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-400">
                  <span>Guest:</span>
                  <span className="text-white font-semibold">{selectedPass.guest_name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Room / Accommodation:</span>
                  <span className="text-white font-semibold truncate max-w-[170px]">{selectedPass.room_title}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Check-In Schedule:</span>
                  <span className="text-white font-semibold">{selectedPass.check_in} (ETA {selectedPass.arrival_time})</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Check-Out Time:</span>
                  <span className="text-amber-300 font-bold">{settings.checkout_time_overnight || '12:00 PM'}</span>
                </div>
                <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1">
                  <span>Total Amount:</span>
                  <span className="text-white font-bold">₱{selectedPass.total_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Balance Due at Front Desk:</span>
                  <span className="text-amber-300 font-bold">
                    {selectedPass.remaining_balance > 0 ? `₱${selectedPass.remaining_balance.toLocaleString()}` : 'Fully Settled'}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 text-center">
                Present this digital pass at the resort front desk gate upon arrival.
              </p>

              <button
                onClick={() => setSelectedPass(null)}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend ETA Modal */}
      {extendModalRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">Request ETA Extension</h3>
              <button onClick={() => setExtendModalRes(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmExtend} className="space-y-3 text-xs">
              <p className="text-slate-400 text-[11px]">
                Booking: <strong className="text-cyan-400">{extendModalRes.code}</strong> ({extendModalRes.guest_name})
              </p>

              <div>
                <label className="block text-slate-400 mb-1 font-medium text-[11px]">New Expected Arrival Time</label>
                <input
                  type="text"
                  value={newEtaTime}
                  onChange={(e) => setNewEtaTime(e.target.value)}
                  placeholder="e.g. 05:00 PM"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium text-[11px]">Reason / Note for Front Desk</label>
                <textarea
                  rows={2}
                  value={etaNote}
                  onChange={(e) => setEtaNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isExtending}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow"
              >
                {isExtending ? 'Updating ETA...' : 'Submit ETA Extension'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
