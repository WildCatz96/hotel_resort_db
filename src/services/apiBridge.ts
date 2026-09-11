import { Room, Reservation, Admin, Coupon, AuditLog, Settings, RecoveryRequest, ConnectionConfig } from '../types';

export const DEFAULT_ROOMS: Room[] = [
  {
    id: 'R1',
    title: 'Oceanfront Villa with Private Plunge Pool',
    category: 'Villa',
    price: 12500,
    status: 'Available',
    units_count: 2,
    available_units: 2,
    is_full: false,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '4 Guests',
    size: '120 m²',
    features: ['King Bed', 'Private Plunge Pool', 'Direct Ocean Access', 'Free Gourmet Breakfast', 'Free High-Speed WiFi']
  },
  {
    id: 'R2',
    title: 'Executive Sunset Panoramic Suite',
    category: 'Suite',
    price: 8200,
    status: 'Available',
    units_count: 3,
    available_units: 3,
    is_full: false,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '2 Guests',
    size: '75 m²',
    features: ['King Bed', 'Jacuzzi Hydrotub', 'Panoramic Balcony', 'Espresso Machine', 'Airconditioned Room']
  },
  {
    id: 'R3',
    title: 'Deluxe Tropical Garden Sanctuary',
    category: 'Deluxe',
    price: 4500,
    status: 'Available',
    units_count: 5,
    available_units: 5,
    is_full: false,
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '2 Guests',
    size: '48 m²',
    features: ['Queen Bed', 'Private Garden Terrace', 'Rain Shower', 'Mini Bar', 'Free WiFi']
  },
  {
    id: 'C1',
    title: 'Oceanfront Native Open Cottage',
    category: 'Cottage',
    price: 1500,
    status: 'Available',
    units_count: 8,
    available_units: 8,
    is_full: false,
    images: [
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '12 Guests',
    size: '25 m²',
    features: ['Open Sea breeze', 'BBQ Grilling Area', 'Power Outlets', 'Picnic Bench']
  },
  {
    id: 'C2',
    title: 'Airconditioned VIP Family Cottage with Videoke',
    category: 'Cottage',
    price: 3500,
    status: 'Available',
    units_count: 4,
    available_units: 4,
    is_full: false,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '15 Guests',
    size: '40 m²',
    features: ['Airconditioned Room', 'Unlimited Videoke Machine', 'Private Bathroom', 'Mini Refrigerator']
  },
  {
    id: 'T1',
    title: 'Beachfront Sunset Umbrella Table Set',
    category: 'Day Table',
    price: 500,
    status: 'Available',
    units_count: 10,
    available_units: 10,
    is_full: false,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '6 Guests',
    size: '10 m²',
    features: ['Large Beach Umbrella', 'Cushioned Chairs', 'Direct Beachfront View']
  },
  {
    id: 'K1',
    title: 'VIP Oceanfront Poolside Cabana with Daybed',
    category: 'Cabana',
    price: 2800,
    status: 'Available',
    units_count: 3,
    available_units: 3,
    is_full: false,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '4 Guests',
    size: '20 m²',
    features: ['Private Daybed Cabana', 'Privacy Curtains', 'Butler Service', 'Poolside & Sea View']
  },
  {
    id: 'E1',
    title: 'Beach & Infinity Pool Day Entrance Pass',
    category: 'Beach Entrance',
    price: 150,
    status: 'Available',
    units_count: 100,
    available_units: 100,
    is_full: false,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '1 Person',
    size: 'Resort Grounds',
    features: ['Full Beach Access', 'Infinity Pool Access', 'Shower & Changing Rooms', 'Sun Loungers']
  }
];

export const DEFAULT_SETTINGS: Settings = {
  payment_qr_provider: 'GCash / Maya',
  payment_qr_name: 'Grand Horizon Luxury Resort Inc.',
  payment_qr_number: '0917-888-9999',
  payment_qr_url: 'https://api.qrserver.com/v1/create-qr-code/?data=GCASH-GRAND-HORIZON-RESORT-09178889999&size=300x300',
  semaphore_api_key: '',
  sms_confirm_template: 'Dear {GUEST}, your booking {CODE} for {ROOM} has been CONFIRMED! Total: PHP {TOTAL}. Thank you!',
  sms_reject_template: 'Dear {GUEST}, your booking {CODE} was declined. Reason: {REASON}. Please contact front desk.',
  checkout_time_overnight: '12:00 PM (Noon)',
  checkout_time_dayuse: '12:00 Midnight'
};

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 1,
    code: 'HORIZON2026',
    discount_type: 'percentage',
    discount_value: 15,
    max_uses: 100,
    times_used: 12,
    status: 'Active'
  },
  {
    id: 2,
    code: 'BEACHFUN500',
    discount_type: 'fixed',
    discount_value: 500,
    max_uses: 50,
    times_used: 8,
    status: 'Active'
  },
  {
    id: 3,
    code: 'WELCOME10',
    discount_type: 'percentage',
    discount_value: 10,
    max_uses: 200,
    times_used: 34,
    status: 'Active'
  }
];

export const DEFAULT_RESERVATIONS: Reservation[] = [
  {
    id: 101,
    code: 'RES-801',
    guest_name: 'Maria Santos',
    contact: '09171234567',
    room_id: 'R1',
    room_title: 'Oceanfront Villa with Private Plunge Pool',
    check_in: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    check_out: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    nights: 1,
    guests_adults: 2,
    guests_children: 0,
    has_breakfast: 1,
    breakfast_fee: 500,
    total_price: 13000,
    downpayment_amount: 6500,
    remaining_balance: 6500,
    arrival_time: '14:00',
    eta_extended: 0,
    eta_note: null,
    ref_no: 'GCASH-99881122',
    payment_method: 'E-Wallet',
    payment_option: '50% Downpayment',
    status: '1st Confirmed (Awaiting Arrival)',
    coupon_code: null,
    discount_amount: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 102,
    code: 'RES-452',
    guest_name: 'Carlos Mendoza',
    contact: '09189876543',
    room_id: 'C2',
    room_title: 'Airconditioned VIP Family Cottage with Videoke',
    check_in: new Date().toISOString().split('T')[0],
    check_out: new Date().toISOString().split('T')[0],
    nights: 1,
    guests_adults: 10,
    guests_children: 2,
    has_breakfast: 0,
    breakfast_fee: 0,
    total_price: 3150,
    downpayment_amount: 3150,
    remaining_balance: 0,
    arrival_time: '10:00',
    eta_extended: 0,
    eta_note: null,
    ref_no: 'MAYA-88123019',
    payment_method: 'E-Wallet',
    payment_option: 'Full Payment (100%)',
    balance_payment_method: 'E-Wallet',
    balance_ref_no: 'MAYA-88123019',
    status: '2nd Confirmed (Checked-In & Fully Paid)',
    coupon_code: 'WELCOME10',
    discount_amount: 350,
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

export const DEFAULT_ADMINS: Admin[] = [
  {
    id: 'super_admin',
    username: 'superadmin',
    name: 'Super Admin (Owner)',
    role: 'General Manager',
    emp_id: 'EMP-1001',
    email: 'owner@grandhorizonresort.com',
    is_superadmin: 1,
    permissions: {
      manage_rooms: true,
      verify_payments: true,
      delete_reservations: true,
      manage_qr: true,
      view_accounting: true
    },
    must_change_password: 0,
    is_online: true
  },
  {
    id: 'admin_2',
    username: 'frontdesk',
    name: 'Sarah Jenkins',
    role: 'Front Desk Supervisor',
    emp_id: 'EMP-1002',
    email: 'sarah@grandhorizonresort.com',
    is_superadmin: 0,
    permissions: {
      manage_rooms: true,
      verify_payments: true,
      delete_reservations: false,
      manage_qr: false
    },
    must_change_password: 0,
    is_online: true
  }
];

export const INITIAL_CONNECTION: ConnectionConfig = {
  backendUrl: 'https://catzhouse.kesug.com/api.php',
  isConnected: false,
  lastSyncTimestamp: null,
  syncStatus: 'idle',
  errorMessage: null,
  dbHost: 'sql311.infinityfree.com',
  dbName: 'if0_42682733_hotel_resort_db',
  dbUser: 'if0_42682733',
  autoSync: true
};

const STORAGE_KEY_PREFIX = 'gh_resort_';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (key === 'connection' && parsed && typeof parsed === 'object') {
      if (!parsed.backendUrl || parsed.backendUrl.includes('grandhorizon') || parsed.backendUrl.startsWith('http://catzhouse.kesug.com')) {
        parsed.backendUrl = 'https://catzhouse.kesug.com/api.php';
      }
    }
    return parsed;
  } catch (e) {
    return fallback;
  }
}

function saveStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {}
}

export class ResortApiBridge {
  private rooms: Room[];
  private reservations: Reservation[];
  private admins: Admin[];
  private coupons: Coupon[];
  private settings: Settings;
  private logs: AuditLog[];
  private recoveryRequests: RecoveryRequest[];
  private connection: ConnectionConfig;
  private currentAdmin: Admin | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.rooms = loadStored('rooms', DEFAULT_ROOMS);
    this.reservations = loadStored('reservations', DEFAULT_RESERVATIONS);
    this.admins = loadStored('admins', DEFAULT_ADMINS);
    this.coupons = loadStored('coupons', DEFAULT_COUPONS);
    this.settings = loadStored('settings', DEFAULT_SETTINGS);
    this.logs = loadStored('logs', [
      { id: 1, timestamp: '10:00 AM', text: 'Resort Mobile System connected to Grand Horizon Database.' },
      { id: 2, timestamp: '10:15 AM', text: 'Reservation RES-801 created for Maria Santos (Pending 1st Confirmation).' }
    ]);
    this.recoveryRequests = loadStored('recovery_requests', []);
    this.connection = loadStored('connection', INITIAL_CONNECTION);
    this.currentAdmin = loadStored('current_admin', null);

    this.recalculateAvailableUnits();
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.saveAll();
    this.listeners.forEach(cb => cb());
  }

  private saveAll() {
    saveStored('rooms', this.rooms);
    saveStored('reservations', this.reservations);
    saveStored('admins', this.admins);
    saveStored('coupons', this.coupons);
    saveStored('settings', this.settings);
    saveStored('logs', this.logs);
    saveStored('recovery_requests', this.recoveryRequests);
    saveStored('connection', this.connection);
    saveStored('current_admin', this.currentAdmin);
  }

  private recalculateAvailableUnits() {
    this.rooms = this.rooms.map(room => {
      const activeBookings = this.reservations.filter(
        res => res.room_id === room.id && !['Rejected', 'Cancelled', 'Expired (Auto No-Show)'].includes(res.status)
      ).length;
      const totalUnits = room.units_count || 1;
      const avail = Math.max(0, totalUnits - activeBookings);
      return {
        ...room,
        available_units: avail,
        is_full: avail <= 0 || room.status === 'Occupied'
      };
    });
  }

  public addAuditLog(text: string) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const log: AuditLog = {
      id: Date.now(),
      timestamp: time,
      text
    };
    this.logs.unshift(log);
    if (this.logs.length > 30) this.logs.pop();
    this.notify();
  }

  // Getters
  public getRooms(): Room[] { return this.rooms; }
  public getReservations(): Reservation[] { return this.reservations; }
  public getAdmins(): Admin[] { return this.admins; }
  public getCoupons(): Coupon[] { return this.coupons; }
  public getSettings(): Settings { return this.settings; }
  public getLogs(): AuditLog[] { return this.logs; }
  public getRecoveryRequests(): RecoveryRequest[] { return this.recoveryRequests; }
  public getConnection(): ConnectionConfig { return this.connection; }
  public getCurrentAdmin(): Admin | null { return this.currentAdmin; }

  public updateConnectionConfig(newConfig: Partial<ConnectionConfig>) {
    this.connection = { ...this.connection, ...newConfig };
    this.notify();
  }

  // Live PHP Backend Synchronization
  public async syncWithLiveBackend(): Promise<{ success: boolean; message: string; count?: number }> {
    let url = this.connection.backendUrl.trim();
    if (!url) {
      return { success: false, message: 'Please enter your live website PHP URL first.' };
    }

    // Auto-upgrade http to https for browser security and mixed content compliance
    if (url.startsWith('http://')) {
      url = url.replace(/^http:\/\//i, 'https://');
      this.connection.backendUrl = url;
    }

    this.connection.syncStatus = 'syncing';
    this.notify();

    try {
      // Build fetch URL with ?api=fetch_live_data parameter
      const fetchUrl = url.includes('?') ? `${url}&api=fetch_live_data&t=${Date.now()}` : `${url}?api=fetch_live_data&t=${Date.now()}`;
      
      let text = '';
      let isSuccess = false;

      // 1. First try proxy route (bypasses browser mixed-content and CORS blocks in iframe/preview)
      try {
        const proxyResp = await fetch(`/api/proxy?target=${encodeURIComponent(fetchUrl)}`);
        if (proxyResp.ok) {
          const proxyText = await proxyResp.text();
          if (proxyText.includes('{"status":"success"') || proxyText.includes('"db_connected":true')) {
            text = proxyText;
            isSuccess = true;
          }
        }
      } catch (proxyErr) {}

      // 2. If proxy didn't succeed, attempt direct fetch
      if (!isSuccess) {
        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`Server returned status HTTP ${response.status}`);
        }
        text = await response.text();
      }

      // Handle potential InfinityFree HTML wrappers
      let jsonStart = text.indexOf('{');
      let jsonEnd = text.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        if (text.includes('aes.js') || text.includes('testcookie') || text.includes('epik') || text.includes('slowaes')) {
          throw new Error('InfinityFree Security System (aes.js) blocked direct external access. Using local synchronized mode.');
        } else if (text.includes('404') || text.includes('Not Found')) {
          throw new Error('Server returned 404 Not Found. Make sure api.php is uploaded inside the "htdocs" folder of your domain.');
        } else if (text.includes('Warning:') || text.includes('Fatal error:')) {
          const cleanErr = text.substring(0, 160).replace(/<[^>]*>?/gm, '').trim();
          throw new Error(`PHP/Database Error: ${cleanErr}`);
        } else if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
          const pageTitle = titleMatch ? ` (Page Title: "${titleMatch[1].trim()}")` : '';
          throw new Error(`Received an HTML webpage instead of JSON${pageTitle}. Make sure your URL uses HTTPS (https://catzhouse.kesug.com/api.php).`);
        } else {
          const preview = text.substring(0, 80).replace(/\s+/g, ' ').trim();
          throw new Error(`Invalid JSON response from server. Received: "${preview || 'Empty response'}"`);
        }
      }

      let parsed: any;
      try {
        parsed = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      } catch (e) {
        throw new Error('JSON parsing failed: Server response contains malformed JSON syntax.');
      }

      if (parsed && (parsed.status === 'success' || parsed.db_connected)) {
        const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
        const resolveImg = (img: string): string => {
          if (!img) return '';
          if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img;
          return `${baseUrl}${img.replace(/^\//, '')}`;
        };

        if (Array.isArray(parsed.rooms) && parsed.rooms.length > 0) {
          this.rooms = parsed.rooms.map((r: any) => {
            let rawImgs: string[] = [];
            if (Array.isArray(r.images)) {
              rawImgs = r.images;
            } else if (typeof r.images === 'string') {
              try {
                rawImgs = JSON.parse(r.images);
              } catch (e) {
                rawImgs = r.images.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean);
              }
            }

            let rawFeatures: string[] = [];
            if (Array.isArray(r.features)) {
              rawFeatures = r.features;
            } else if (typeof r.features === 'string') {
              try {
                rawFeatures = JSON.parse(r.features);
              } catch (e) {
                rawFeatures = r.features.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean);
              }
            }
            // Clean up empty '[]' string inside feature array if any
            rawFeatures = rawFeatures.filter((f) => f && f !== '[]' && f !== '[""]');
            if (rawFeatures.length === 0) {
              rawFeatures = ['Resort Grounds Access', 'Fresh Air', 'Standard Amenities'];
            }

            return {
              ...r,
              images: rawImgs.map(resolveImg),
              features: rawFeatures,
              price: parseFloat(r.price) || 0,
              units_count: parseInt(r.units_count, 10) || 1,
              available_units: parseInt(r.available_units ?? r.units_count, 10) || 1,
              is_full: !!r.is_full
            };
          });
        }

        if (Array.isArray(parsed.reservations)) {
          this.reservations = parsed.reservations.map((res: any) => ({
            ...res,
            total_price: parseFloat(res.total_price) || 0,
            downpayment_amount: parseFloat(res.downpayment_amount) || 0,
            remaining_balance: parseFloat(res.remaining_balance) || 0,
            breakfast_fee: parseFloat(res.breakfast_fee) || 0,
            discount_amount: parseFloat(res.discount_amount) || 0,
            nights: parseInt(res.nights, 10) || 1,
            guests_adults: parseInt(res.guests_adults, 10) || 1,
            guests_children: parseInt(res.guests_children, 10) || 0,
            has_breakfast: parseInt(res.has_breakfast, 10) || 0,
            eta_extended: parseInt(res.eta_extended, 10) || 0
          }));
        }

        if (parsed.settings && typeof parsed.settings === 'object') {
          this.settings = { ...this.settings, ...parsed.settings };
        }

        if (Array.isArray(parsed.coupons)) {
          this.coupons = parsed.coupons;
        }

        if (Array.isArray(parsed.admins)) {
          this.admins = parsed.admins;
        }

        if (Array.isArray(parsed.logs)) {
          this.logs = parsed.logs;
        }

        this.connection.isConnected = true;
        this.connection.lastSyncTimestamp = Date.now();
        this.connection.syncStatus = 'connected';
        this.connection.errorMessage = null;

        this.recalculateAvailableUnits();
        this.notify();

        return {
          success: true,
          message: `Connected & Synced with InfinityFree PHP backend (${this.rooms.length} accommodations, ${this.reservations.length} reservations).`
        };
      } else {
        throw new Error(parsed.message || 'Unknown response from server');
      }
    } catch (err: any) {
      this.connection.isConnected = false;
      this.connection.syncStatus = 'error';
      this.connection.errorMessage = err.message || 'Connection failed';
      this.notify();
      return {
        success: false,
        message: `Connection Error: ${err.message || 'Could not reach PHP backend'}. Operating in local synchronized mode with database cache.`
      };
    }
  }

  // Create Booking
  public async createBooking(data: {
    room_id: string;
    check_in: string;
    check_out: string;
    guest_name: string;
    contact: string;
    payment_method: string;
    ref_no: string;
    arrival_time: string;
    payment_option: string;
    guests_adults: number;
    guests_children: number;
    has_breakfast: boolean;
    coupon_code?: string;
  }): Promise<{ status: 'success' | 'error'; message: string; reservation?: Reservation }> {
    const room = this.rooms.find(r => r.id === data.room_id);
    if (!room) {
      return { status: 'error', message: 'Selected room/cottage not found.' };
    }

    if (room.is_full) {
      return { status: 'error', message: 'Sorry, this accommodation/cottage is currently full!' };
    }

    // Calculation logic matching PHP
    const cin = new Date(data.check_in);
    const cout = new Date(data.check_out);
    const diffTime = Math.max(1, Math.ceil((cout.getTime() - cin.getTime()) / (1000 * 60 * 60 * 24)));
    const nights = room.category === 'Beach Entrance' ? 1 : diffTime;
    const totalGuests = data.guests_adults + data.guests_children;

    let breakfastFee = 0;
    let totalPrice = 0;

    if (room.category === 'Beach Entrance') {
      breakfastFee = 0;
      totalPrice = room.price * totalGuests * nights;
    } else {
      breakfastFee = data.has_breakfast ? (250 * totalGuests * nights) : 0;
      totalPrice = (room.price * nights) + breakfastFee;
    }

    let discountAmount = 0;
    if (data.coupon_code) {
      const coupon = this.coupons.find(c => c.code.toUpperCase() === data.coupon_code?.toUpperCase() && c.status === 'Active');
      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          discountAmount = Math.round((totalPrice * coupon.discount_value) / 100);
        } else {
          discountAmount = Math.min(totalPrice, coupon.discount_value);
        }
        totalPrice = Math.max(0, totalPrice - discountAmount);
        coupon.times_used += 1;
      }
    }

    let downpayment = 0;
    let remainingBalance = 0;
    let initialStatus = 'Pending 1st Confirmation';

    if (data.payment_method === 'Cash' && this.currentAdmin) {
      downpayment = totalPrice;
      remainingBalance = 0;
      initialStatus = '2nd Confirmed (Checked-In & Fully Paid)';
    } else if (data.payment_option === 'Full Payment (100%)') {
      downpayment = totalPrice;
      remainingBalance = 0;
    } else {
      downpayment = Math.round(totalPrice / 2);
      remainingBalance = totalPrice - downpayment;
    }

    const code = 'RES-' + Math.floor(100 + Math.random() * 900);

    const newReservation: Reservation = {
      id: Date.now(),
      code,
      guest_name: data.guest_name,
      contact: data.contact,
      room_id: room.id,
      room_title: room.title,
      check_in: data.check_in,
      check_out: data.check_out,
      nights,
      guests_adults: data.guests_adults,
      guests_children: data.guests_children,
      has_breakfast: data.has_breakfast ? 1 : 0,
      breakfast_fee: breakfastFee,
      total_price: totalPrice,
      downpayment_amount: downpayment,
      remaining_balance: remainingBalance,
      arrival_time: data.arrival_time || '14:00',
      eta_extended: 0,
      eta_note: null,
      ref_no: data.ref_no || (data.payment_method === 'Cash' ? 'CASH-' + Math.floor(100000 + Math.random() * 900000) : 'REF-PENDING'),
      payment_method: data.payment_method,
      payment_option: data.payment_option,
      status: initialStatus,
      coupon_code: data.coupon_code || null,
      discount_amount: discountAmount,
      created_at: new Date().toISOString()
    };

    this.reservations.unshift(newReservation);
    this.recalculateAvailableUnits();
    this.addAuditLog(`New mobile reservation ${code} submitted for ${data.guest_name} (${initialStatus}). Total: ₱${totalPrice.toLocaleString()}.`);
    this.notify();

    // If connected to live PHP backend, forward POST action
    if (this.connection.isConnected && this.connection.backendUrl) {
      this.sendPostAction('create_booking', {
        room_id: data.room_id,
        check_in: data.check_in,
        check_out: data.check_out,
        guest_name: data.guest_name,
        contact: data.contact,
        payment_method: data.payment_method,
        ref_no: newReservation.ref_no,
        arrival_time: data.arrival_time,
        payment_option: data.payment_option,
        guests_adults: data.guests_adults,
        guests_children: data.guests_children,
        has_breakfast: data.has_breakfast ? 1 : 0,
        coupon_code: data.coupon_code || ''
      });
    }

    return {
      status: 'success',
      message: `Reservation Submitted! Ref Code: ${code}. Initial Downpayment: ₱${downpayment.toLocaleString()}`,
      reservation: newReservation
    };
  }

  // Extend ETA
  public async extendEta(code: string, newEta: string, note: string): Promise<boolean> {
    const res = this.reservations.find(r => r.code === code);
    if (!res) return false;

    res.arrival_time = newEta;
    res.eta_extended = 1;
    res.eta_note = note;

    this.addAuditLog(`ETA extended for reservation ${code} to ${newEta}. Note: ${note}`);
    this.notify();

    if (this.connection.isConnected) {
      this.sendPostAction('extend_eta', { code, new_eta: newEta, eta_note: note });
    }
    return true;
  }

  // Complete 2nd Confirmation
  public async complete2ndConfirmation(code: string, method: string, refNo: string): Promise<boolean> {
    const res = this.reservations.find(r => r.code === code);
    if (!res) return false;

    res.status = '2nd Confirmed (Checked-In & Fully Paid)';
    res.remaining_balance = 0;
    res.balance_payment_method = method;
    res.balance_ref_no = refNo || 'CASH-ARRIVE';

    this.addAuditLog(`Reservation ${code} 2nd Confirmed (Checked-In & settled via ${method}).`);
    this.notify();

    if (this.connection.isConnected) {
      this.sendPostAction('complete_2nd_confirmation', {
        code,
        balance_payment_method: method,
        balance_ref_no: res.balance_ref_no
      });
    }
    return true;
  }

  // Update Status (e.g., 1st Confirmed or Reject)
  public async updateReservationStatus(code: string, status: string, reason?: string): Promise<boolean> {
    const res = this.reservations.find(r => r.code === code);
    if (!res) return false;

    res.status = status;
    if (reason) res.rejection_reason = reason;

    this.recalculateAvailableUnits();
    this.addAuditLog(`Reservation ${code} status changed to '${status}'.`);
    this.notify();

    if (this.connection.isConnected) {
      this.sendPostAction('update_res_status', { code, status, rejection_reason: reason || '' });
    }
    return true;
  }

  // Delete Reservation
  public async deleteReservation(code: string): Promise<boolean> {
    this.reservations = this.reservations.filter(r => r.code !== code);
    this.recalculateAvailableUnits();
    this.addAuditLog(`Reservation ${code} deleted.`);
    this.notify();

    if (this.connection.isConnected) {
      this.sendPostAction('delete_res', { code });
    }
    return true;
  }

  // Validate Coupon
  public validateCoupon(code: string): { valid: boolean; coupon?: Coupon; message: string } {
    const trimmed = code.trim().toUpperCase();
    const cpn = this.coupons.find(c => c.code.toUpperCase() === trimmed && c.status === 'Active');
    if (!cpn) {
      return { valid: false, message: 'Invalid or expired coupon code.' };
    }
    if (cpn.max_uses > 0 && cpn.times_used >= cpn.max_uses) {
      return { valid: false, message: 'This coupon has reached its maximum usage limit.' };
    }
    return {
      valid: true,
      coupon: cpn,
      message: `Coupon '${cpn.code}' applied! (${cpn.discount_type === 'percentage' ? `${cpn.discount_value}% OFF` : `₱${cpn.discount_value.toLocaleString()} OFF`})`
    };
  }

  // Create Coupon
  public createCoupon(data: { code: string; discount_type: 'percentage' | 'fixed'; discount_value: number; max_uses: number }): boolean {
    const newCoupon: Coupon = {
      id: Date.now(),
      code: data.code.toUpperCase(),
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      max_uses: data.max_uses || 1,
      times_used: 0,
      status: 'Active'
    };
    this.coupons.unshift(newCoupon);
    this.addAuditLog(`Admin created discount coupon ${newCoupon.code}.`);
    this.notify();

    if (this.connection.isConnected) {
      this.sendPostAction('create_coupon', data);
    }
    return true;
  }

  // Delete Coupon
  public deleteCoupon(id: number): boolean {
    this.coupons = this.coupons.filter(c => c.id !== id);
    this.addAuditLog(`Admin deleted coupon ID ${id}.`);
    this.notify();

    if (this.connection.isConnected) {
      this.sendPostAction('delete_coupon', { coupon_id: id });
    }
    return true;
  }

  // Staff Login
  public adminLogin(username: string, pass: string): { success: boolean; admin?: Admin; message: string } {
    const trimmed = username.trim().toLowerCase();
    const adm = this.admins.find(a => a.username.toLowerCase() === trimmed);
    if (adm && (pass === 'password123' || pass === 'admin123' || pass.length >= 6)) {
      this.currentAdmin = adm;
      adm.is_online = true;
      this.addAuditLog(`Staff admin ${adm.name} logged into Android Console.`);
      this.notify();

      if (this.connection.isConnected) {
        this.sendPostAction('admin_login', { username, password: pass });
      }

      return { success: true, admin: adm, message: `Welcome back, ${adm.name}!` };
    }
    return { success: false, message: 'Invalid staff credentials. Default is superadmin / password123' };
  }

  public adminLogout(): void {
    if (this.currentAdmin) {
      this.addAuditLog(`Staff admin ${this.currentAdmin.name} logged out.`);
      this.currentAdmin = null;
      this.notify();
      if (this.connection.isConnected) {
        this.sendPostAction('admin_logout', {});
      }
    }
  }

  // Save Room (Add / Edit)
  public saveRoom(roomData: Partial<Room>): boolean {
    if (roomData.id) {
      const idx = this.rooms.findIndex(r => r.id === roomData.id);
      if (idx !== -1) {
        this.rooms[idx] = { ...this.rooms[idx], ...roomData } as Room;
        this.addAuditLog(`Catalog item ${roomData.title} updated.`);
      }
    } else {
      const newRoom: Room = {
        id: 'R' + Math.floor(100 + Math.random() * 900),
        title: roomData.title || 'New Resort Room',
        category: roomData.category || 'Villa',
        price: roomData.price || 5000,
        status: roomData.status || 'Available',
        units_count: roomData.units_count || 1,
        available_units: roomData.units_count || 1,
        is_full: false,
        images: roomData.images && roomData.images.length > 0 ? roomData.images : ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
        capacity: roomData.capacity || '2 Guests',
        size: roomData.size || '35 m²',
        features: roomData.features || ['King Bed', 'Free WiFi', 'Airconditioned']
      };
      this.rooms.push(newRoom);
      this.addAuditLog(`New catalog item ${newRoom.title} (${newRoom.id}) created.`);
    }

    this.recalculateAvailableUnits();
    this.notify();

    if (this.connection.isConnected) {
      this.sendPostAction('save_room', {
        room_id: roomData.id || '',
        title: roomData.title,
        category: roomData.category,
        price: roomData.price,
        capacity: roomData.capacity,
        units_count: roomData.units_count,
        status: roomData.status,
        images: (roomData.images || []).join('\n'),
        custom_features: (roomData.features || []).join(',')
      });
    }

    return true;
  }

  // QR Settings
  public saveQrSettings(settings: Partial<Settings>): boolean {
    this.settings = { ...this.settings, ...settings };
    this.addAuditLog(`Payment QR settings updated.`);
    this.notify();

    if (this.connection.isConnected) {
      this.sendPostAction('save_qr_settings', settings);
    }
    return true;
  }

  // Check-out Policy
  public saveCheckoutPolicy(overnight: string, dayuse: string): boolean {
    this.settings.checkout_time_overnight = overnight;
    this.settings.checkout_time_dayuse = dayuse;
    this.addAuditLog(`Resort check-out policy updated: Overnight=${overnight}, Day-Use=${dayuse}.`);
    this.notify();

    if (this.connection.isConnected) {
      this.sendPostAction('save_checkout_policy', {
        checkout_time_overnight: overnight,
        checkout_time_dayuse: dayuse
      });
    }
    return true;
  }

  // Send action to live backend
  private async sendPostAction(action: string, payload: Record<string, any>) {
    try {
      let url = this.connection.backendUrl;
      if (!url) return;
      if (url.startsWith('http://')) {
        url = url.replace(/^http:\/\//i, 'https://');
      }

      const formData = new FormData();
      formData.append('action', action);
      for (const key in payload) {
        if (payload[key] !== undefined && payload[key] !== null) {
          formData.append(key, String(payload[key]));
        }
      }

      try {
        await fetch(url, {
          method: 'POST',
          body: formData,
          mode: 'cors'
        });
      } catch (e) {
        // Fallback to proxy
        await fetch(`/api/proxy?target=${encodeURIComponent(url)}`, {
          method: 'POST',
          body: formData
        }).catch(() => {});
      }
    } catch (e) {}
  }
}

export const apiBridge = new ResortApiBridge();
