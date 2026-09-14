import React, { useState, useEffect } from 'react';
import { apiBridge } from './services/apiBridge';
import { Room, Reservation, Coupon, Settings, ConnectionConfig } from './types';
import { AndroidFrame, GuestTab } from './components/AndroidFrame';
import { ExploreTab } from './components/ExploreTab';
import { BookingModal } from './components/BookingModal';
import { ReservationsTab } from './components/ReservationsTab';
import { DealsTab } from './components/DealsTab';
import { ResortGuideTab } from './components/ResortGuideTab';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<GuestTab>('explore');
  
  // State from apiBridge
  const [rooms, setRooms] = useState<Room[]>(apiBridge.getRooms());
  const [reservations, setReservations] = useState<Reservation[]>(apiBridge.getReservations());
  const [coupons, setCoupons] = useState<Coupon[]>(apiBridge.getCoupons());
  const [settings, setSettings] = useState<Settings>(apiBridge.getSettings());
  const [connection, setConnection] = useState<ConnectionConfig>(apiBridge.getConnection());

  // Modal states
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [detailsRoom, setDetailsRoom] = useState<Room | null>(null);
  const [successToast, setSuccessToast] = useState<{ title: string; message: string; code?: string } | null>(null);

  // Subscribe to apiBridge changes
  useEffect(() => {
    const unsubscribe = apiBridge.subscribe(() => {
      setRooms([...apiBridge.getRooms()]);
      setReservations([...apiBridge.getReservations()]);
      setCoupons([...apiBridge.getCoupons()]);
      setSettings({ ...apiBridge.getSettings() });
      setConnection({ ...apiBridge.getConnection() });
    });
    return unsubscribe;
  }, []);

  // Background auto-sync if URL is configured
  useEffect(() => {
    if (!connection.backendUrl || !connection.autoSync) return;

    // Initial background sync check
    apiBridge.syncWithLiveBackend().catch(() => {});

    // Periodic sync every 15 seconds
    const timer = setInterval(() => {
      apiBridge.syncWithLiveBackend().catch(() => {});
    }, 15000);

    return () => clearInterval(timer);
  }, [connection.backendUrl, connection.autoSync]);

  const handleBookingSuccess = (newRes: Reservation) => {
    setSuccessToast({
      title: 'Booking Confirmed!',
      message: `Your reservation code is ${newRes.code}. Downpayment: ₱${newRes.downpayment_amount.toLocaleString()}. Check-in: ${newRes.check_in}.`,
      code: newRes.code
    });
    setActiveTab('bookings');
  };

  return (
    <AndroidFrame
      activeTab={activeTab}
      onTabChange={setActiveTab}
      connection={connection}
      activeBookingCount={reservations.length}
    >
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl text-xs text-white shadow-xl flex items-start justify-between gap-3 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-xs">{successToast.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {successToast.message}
              </p>
              {successToast.code && (
                <div className="mt-1 font-mono text-[10px] text-cyan-400 font-bold">
                  Reference: {successToast.code}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: EXPLORE */}
      {activeTab === 'explore' && (
        <ExploreTab
          rooms={rooms}
          onSelectRoom={(room) => setBookingRoom(room)}
          onViewDetails={(room) => setDetailsRoom(room)}
        />
      )}

      {/* TAB 2: MY BOOKINGS / TRACK */}
      {activeTab === 'bookings' && (
        <ReservationsTab
          reservations={reservations}
          settings={settings}
          onExtendEta={async (code, newEta, note) => {
            return await apiBridge.extendEta(code, newEta, note);
          }}
        />
      )}

      {/* TAB 3: DEALS */}
      {activeTab === 'deals' && (
        <DealsTab
          coupons={coupons}
          onSelectCoupon={(code) => {
            setActiveTab('explore');
          }}
        />
      )}

      {/* TAB 4: GUEST SERVICES & RESORT GUIDE */}
      {activeTab === 'guide' && (
        <ResortGuideTab
          settings={settings}
          onOpenBooking={() => {
            const avail = rooms.find(r => !r.is_full) || rooms[0];
            setBookingRoom(avail);
          }}
        />
      )}

      {/* MODAL 1: BOOKING BOTTOM SHEET */}
      {bookingRoom && (
        <BookingModal
          room={bookingRoom}
          settings={settings}
          onClose={() => setBookingRoom(null)}
          onSubmit={(data) => apiBridge.createBooking(data)}
          onValidateCoupon={(code) => apiBridge.validateCoupon(code)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* MODAL 2: ROOM DETAILS & GALLERY */}
      {detailsRoom && (
        <RoomDetailsModal
          room={detailsRoom}
          onClose={() => setDetailsRoom(null)}
          onBookNow={(room) => {
            setDetailsRoom(null);
            setBookingRoom(room);
          }}
        />
      )}
    </AndroidFrame>
  );
}
