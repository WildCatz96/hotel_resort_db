import React, { useState } from 'react';
import { Admin, Reservation, Room, Coupon, Settings, AuditLog } from '../types';
import { 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit, 
  QrCode, 
  KeyRound, 
  FileText, 
  Search, 
  Users, 
  AlertCircle,
  Smartphone,
  BedDouble,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface StaffTabProps {
  currentAdmin: Admin | null;
  reservations: Reservation[];
  rooms: Room[];
  coupons: Coupon[];
  settings: Settings;
  logs: AuditLog[];
  onLogin: (username: string, pass: string) => { success: boolean; admin?: Admin; message: string };
  onLogout: () => void;
  onUpdateStatus: (code: string, status: string, reason?: string) => Promise<boolean>;
  onComplete2ndConfirmation: (code: string, method: string, refNo: string) => Promise<boolean>;
  onExtendEta: (code: string, newEta: string, note: string) => Promise<boolean>;
  onDeleteReservation: (code: string) => Promise<boolean>;
  onSaveRoom: (room: Partial<Room>) => boolean;
  onCreateCoupon: (coupon: any) => boolean;
  onDeleteCoupon: (id: number) => boolean;
  onSaveQrSettings: (settings: Partial<Settings>) => boolean;
  onSavePolicies: (overnight: string, dayuse: string) => boolean;
  onOpenWalkInBooking: () => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  currentAdmin,
  reservations,
  rooms,
  coupons,
  settings,
  logs,
  onLogin,
  onLogout,
  onUpdateStatus,
  onComplete2ndConfirmation,
  onExtendEta,
  onDeleteReservation,
  onSaveRoom,
  onCreateCoupon,
  onDeleteCoupon,
  onSaveQrSettings,
  onSavePolicies,
  onOpenWalkInBooking
}) => {
  // Login form state
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sub-navigation within Staff Console
  const [subTab, setSubTab] = useState<'queue' | 'rooms' | 'coupons' | 'settings' | 'logs'>('queue');
  const [resFilter, setResFilter] = useState<'all' | 'pending' | 'awaiting' | 'checked_in'>('all');

  // Modals for actions
  const [settleModalRes, setSettleModalRes] = useState<Reservation | null>(null);
  const [settleMethod, setSettleMethod] = useState<'Cash' | 'E-Wallet'>('Cash');
  const [settleRefNo, setSettleRefNo] = useState('');

  const [rejectModalRes, setRejectModalRes] = useState<Reservation | null>(null);
  const [rejectReason, setRejectReason] = useState('Invalid or unverified downpayment reference number.');

  const [roomModalData, setRoomModalData] = useState<Partial<Room> | null>(null);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState<number>(10);
  const [newCouponMax, setNewCouponMax] = useState<number>(50);

  // Policy edit state
  const [editOvernight, setEditOvernight] = useState(settings.checkout_time_overnight || '12:00 PM (Noon)');
  const [editDayuse, setEditDayuse] = useState(settings.checkout_time_dayuse || '12:00 Midnight');
  const [editQrName, setEditQrName] = useState(settings.payment_qr_name || 'Grand Horizon Luxury Resort Inc.');
  const [editQrNum, setEditQrNum] = useState(settings.payment_qr_number || '0917-888-9999');
  const [editQrUrl, setEditQrUrl] = useState(settings.payment_qr_url || '');

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = onLogin(username, password);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  if (!currentAdmin) {
    return (
      <div className="space-y-4 pb-24">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl text-center space-y-4 max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Staff Management Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Front Desk verification, check-in settlement, room inventory & system audit logs
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-200 text-xs text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-3 text-left">
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">Staff Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="superadmin"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">Access Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 text-white font-bold text-xs shadow-md transition"
            >
              Log In to Front Desk
            </button>
          </form>

          {/* Quick Credential Helper Pill */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-amber-400" />
              Default System Credentials:
            </div>
            <div className="flex justify-between font-mono text-[10px]">
              <span>User: <strong className="text-white">superadmin</strong></span>
              <span>Pass: <strong className="text-white">password123</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered reservations for staff
  const filteredReservations = reservations.filter(res => {
    if (resFilter === 'pending') return res.status === 'Pending 1st Confirmation';
    if (resFilter === 'awaiting') return res.status === '1st Confirmed (Awaiting Arrival)';
    if (resFilter === 'checked_in') return res.status === '2nd Confirmed (Checked-In & Fully Paid)';
    return true;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Staff User Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow">
            {currentAdmin.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-sm">{currentAdmin.name}</h3>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-cyan-400 font-medium">
              {currentAdmin.role} ({currentAdmin.emp_id})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWalkInBooking}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-sm transition"
            title="Register Walk-In Customer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Walk-In</span>
          </button>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Staff Sub-Tabs Navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'queue', label: 'Reservations', icon: UserCheck, count: reservations.filter(r => r.status === 'Pending 1st Confirmation').length },
          { id: 'rooms', label: 'Accommodations', icon: BedDouble, count: rooms.length },
          { id: 'coupons', label: 'Coupons', icon: Sparkles, count: coupons.length },
          { id: 'settings', label: 'QR & Policies', icon: QrCode },
          { id: 'logs', label: 'Audit Logs', icon: FileText }
        ].map(item => {
          const Icon = item.icon;
          const isActive = subTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSubTab(item.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  item.id === 'queue' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: RESERVATIONS QUEUE & 2-STAGE VERIFICATION */}
      {subTab === 'queue' && (
        <div className="space-y-3">
          {/* Status Filter Buttons */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Stays' },
              { id: 'pending', label: 'Pending 1st Confirm' },
              { id: 'awaiting', label: '1st Confirmed (Awaiting)' },
              { id: 'checked_in', label: 'Checked In / Paid' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setResFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  resFilter === f.id
                    ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards List */}
          {filteredReservations.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No reservations in this view.
            </div>
          ) : (
            filteredReservations.map((res) => {
              const isPending1st = res.status === 'Pending 1st Confirmation';
              const isAwaitingArrival = res.status === '1st Confirmed (Awaiting Arrival)';

              return (
                <div
                  key={res.code}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400 text-xs">{res.code}</span>
                        <span className="text-[10px] text-slate-400">{res.payment_method}</span>
                      </div>
                      <h4 className="font-semibold text-white text-sm">{res.guest_name}</h4>
                      <p className="text-[11px] text-slate-300">{res.room_title}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-amber-300">₱{res.total_price.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {res.nights}n • ETA: {res.arrival_time}
                      </div>
                    </div>
                  </div>

                  {/* Payment Details Pill */}
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Payment Option & Ref</span>
                      <span className="font-mono text-cyan-300">{res.payment_option}</span>
                      <div className="text-[10px] text-slate-400 font-mono">Ref: {res.ref_no}</div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Settlement</span>
                      <div className="text-emerald-400 font-bold">DP: ₱{res.downpayment_amount.toLocaleString()}</div>
                      <div className="text-amber-300 text-[10px]">Bal: ₱{res.remaining_balance.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* 2-STAGE VERIFICATION ACTION BAR */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-semibold text-slate-400">
                      Status: <strong className="text-white">{res.status}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Step 1: Approve 1st Confirmation (Verifying DP) */}
                      {isPending1st && (
                        <>
                          <button
                            onClick={() => setRejectModalRes(res)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-rose-300 text-[11px] font-semibold transition"
                          >
                            Decline
                          </button>

                          <button
                            onClick={() => onUpdateStatus(res.code, '1st Confirmed (Awaiting Arrival)')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold shadow transition"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>1st Confirm (DP Verified)</span>
                          </button>
                        </>
                      )}

                      {/* Step 2: Guest Arrives -> Complete 2nd Confirmation (Check-in & Settle Balance) */}
                      {isAwaitingArrival && (
                        <button
                          onClick={() => {
                            setSettleModalRes(res);
                            setSettleRefNo('');
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Check-In & Settle Balance</span>
                        </button>
                      )}

                      {/* Superadmin Delete */}
                      {currentAdmin.is_superadmin === 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete reservation ${res.code}?`)) {
                              onDeleteReservation(res.code);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SUB-TAB 2: ACCOMMODATIONS CATALOG */}
      {subTab === 'rooms' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resort Accommodations</h4>
            <button
              onClick={() => setRoomModalData({
                title: '',
                category: 'Villa',
                price: 5000,
                units_count: 1,
                capacity: '2 Guests',
                status: 'Available',
                images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
                features: ['Free WiFi', 'Airconditioned']
              })}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Accommodation</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {rooms.map(room => (
              <div
                key={room.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 shadow"
              >
                <img
                  src={room.images[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'}
                  alt={room.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                      {room.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{room.units_count} Total Units</span>
                  </div>
                  <h4 className="font-semibold text-white text-xs truncate mt-0.5">{room.title}</h4>
                  <div className="text-amber-300 font-bold text-xs mt-0.5">
                    ₱{room.price.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => setRoomModalData(room)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PROMO COUPONS */}
      {subTab === 'coupons' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Coupon Discounts</h4>
            <button
              onClick={() => setCouponModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="space-y-2">
            {coupons.map(coupon => (
              <div
                key={coupon.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300 text-xs">{coupon.code}</span>
                    <span className="text-emerald-400 font-bold text-xs">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₱${coupon.discount_value} OFF`}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Used {coupon.times_used} of {coupon.max_uses} times • Status: {coupon.status}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteCoupon(coupon.id)}
                  className="p-2 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: QR & POLICIES */}
      {subTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-cyan-400" />
              Payment QR & E-Wallet Settings
            </h4>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Account Holder Name</label>
              <input
                type="text"
                value={editQrName}
                onChange={(e) => setEditQrName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">GCash / Maya Mobile Number</label>
              <input
                type="text"
                value={editQrNum}
                onChange={(e) => setEditQrNum(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">QR Code Image URL</label>
              <input
                type="text"
                value={editQrUrl}
                onChange={(e) => setEditQrUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
              />
            </div>

            <button
              onClick={() => onSaveQrSettings({
                payment_qr_name: editQrName,
                payment_qr_number: editQrNum,
                payment_qr_url: editQrUrl
              })}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow"
            >
              Update Payment QR Information
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Check-Out Schedule Policy
            </h4>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Overnight Check-Out Time</label>
              <input
                type="text"
                value={editOvernight}
                onChange={(e) => setEditOvernight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Day-Use Cottages Check-Out Time</label>
              <input
                type="text"
                value={editDayuse}
                onChange={(e) => setEditDayuse(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={() => onSavePolicies(editOvernight, editDayuse)}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow"
            >
              Update Check-Out Policy
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: AUDIT LOGS */}
      {subTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" />
            System & Front Desk Activity Logs
          </h4>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 text-xs">
            {logs.map((log) => (
              <div key={log.id} className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="text-[10px] font-mono text-cyan-400 shrink-0 mt-0.5">{log.timestamp}</span>
                <span className="text-slate-300 text-[11px]">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Settle Remaining Balance upon Arrival (2nd Confirmation) */}
      {settleModalRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-2xl">
            <h3 className="font-bold text-white text-sm">Complete 2nd Confirmation (Check-In)</h3>
            <p className="text-slate-400 text-xs">
              Guest: <strong className="text-white">{settleModalRes.guest_name}</strong> ({settleModalRes.code})
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Room:</span>
                <span className="text-white font-semibold">{settleModalRes.room_title}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Downpayment Paid:</span>
                <span className="text-emerald-400 font-bold">₱{settleModalRes.downpayment_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-1">
                <span>Balance to Collect Now:</span>
                <span className="text-amber-300 font-bold text-sm">
                  ₱{settleModalRes.remaining_balance.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-medium">Balance Settlement Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettleMethod('Cash')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    settleMethod === 'Cash' ? 'bg-cyan-950 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Cash at Desk
                </button>
                <button
                  type="button"
                  onClick={() => setSettleMethod('E-Wallet')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    settleMethod === 'E-Wallet' ? 'bg-cyan-950 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  GCash / Maya QR
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-medium">Receipt / Transaction Ref Number</label>
              <input
                type="text"
                placeholder={settleMethod === 'Cash' ? 'OR-10293' : 'GCASH-998811'}
                value={settleRefNo}
                onChange={(e) => setSettleRefNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSettleModalRes(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onComplete2ndConfirmation(settleModalRes.code, settleMethod, settleRefNo || 'CASH-SETTLE');
                  setSettleModalRes(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
              >
                Confirm & Check In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Reject Reservation */}
      {rejectModalRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-2xl">
            <h3 className="font-bold text-rose-300 text-sm">Decline Reservation ({rejectModalRes.code})</h3>
            <p className="text-slate-400 text-xs">
              State the reason why this booking could not be verified:
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-rose-500"
            />

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setRejectModalRes(null)}
                className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={async () => {
                  await onUpdateStatus(rejectModalRes.code, 'Rejected', rejectReason);
                  setRejectModalRes(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Room */}
      {roomModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-white text-sm">
              {roomModalData.id ? 'Edit Accommodation' : 'New Accommodation'}
            </h3>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Title</label>
              <input
                type="text"
                value={roomModalData.title || ''}
                onChange={(e) => setRoomModalData({ ...roomModalData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Category</label>
                <select
                  value={roomModalData.category || 'Villa'}
                  onChange={(e) => setRoomModalData({ ...roomModalData, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white text-xs"
                >
                  <option value="Villa">Villa</option>
                  <option value="Suite">Suite</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Cottage">Cottage</option>
                  <option value="Cabana">Cabana</option>
                  <option value="Day Table">Day Table</option>
                  <option value="Beach Entrance">Beach Entrance</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Rate (₱)</label>
                <input
                  type="number"
                  value={roomModalData.price || 0}
                  onChange={(e) => setRoomModalData({ ...roomModalData, price: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Total Units Count</label>
                <input
                  type="number"
                  value={roomModalData.units_count || 1}
                  onChange={(e) => setRoomModalData({ ...roomModalData, units_count: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Guest Capacity</label>
                <input
                  type="text"
                  value={roomModalData.capacity || '2 Guests'}
                  onChange={(e) => setRoomModalData({ ...roomModalData, capacity: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Image URL</label>
              <input
                type="text"
                value={roomModalData.images?.[0] || ''}
                onChange={(e) => setRoomModalData({ ...roomModalData, images: [e.target.value] })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono text-[11px]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRoomModalData(null)}
                className="flex-1 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSaveRoom(roomModalData);
                  setRoomModalData(null);
                }}
                className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
              >
                Save Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create Coupon */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-2xl">
            <h3 className="font-bold text-white text-sm">Create Promo Coupon</h3>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Coupon Code</label>
              <input
                type="text"
                placeholder="SUMMER2026"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Discount Type</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white text-xs"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Cash (₱)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Discount Value</label>
                <input
                  type="number"
                  value={newCouponVal}
                  onChange={(e) => setNewCouponVal(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Max Redemptions</label>
              <input
                type="number"
                value={newCouponMax}
                onChange={(e) => setNewCouponMax(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCouponModalOpen(false)}
                className="flex-1 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newCouponCode.trim()) {
                    onCreateCoupon({
                      code: newCouponCode.trim(),
                      discount_type: newCouponType,
                      discount_value: newCouponVal,
                      max_uses: newCouponMax
                    });
                    setCouponModalOpen(false);
                    setNewCouponCode('');
                  }
                }}
                className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
