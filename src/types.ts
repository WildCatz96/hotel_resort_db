export interface Room {
  id: string;
  title: string;
  category: 'Villa' | 'Suite' | 'Deluxe' | 'Cottage' | 'Day Table' | 'Cabana' | 'Beach Entrance';
  price: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
  units_count: number;
  available_units: number;
  is_full: boolean;
  images: string[];
  capacity: string;
  size: string;
  features: string[];
}

export interface Reservation {
  id: number;
  code: string;
  guest_name: string;
  contact: string;
  room_id: string;
  room_title: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests_adults: number;
  guests_children: number;
  has_breakfast: number;
  breakfast_fee: number;
  total_price: number;
  downpayment_amount: number;
  remaining_balance: number;
  arrival_time: string;
  eta_extended: number;
  eta_note?: string | null;
  ref_no: string;
  payment_method: string;
  payment_option: string;
  balance_payment_method?: string | null;
  balance_ref_no?: string | null;
  status: string;
  rejection_reason?: string | null;
  sms_status?: string | null;
  coupon_code?: string | null;
  discount_amount: number;
  created_at: string;
}

export interface Admin {
  id: string;
  username: string;
  name: string;
  role: string;
  emp_id: string;
  email: string;
  is_superadmin: number;
  permissions: {
    manage_rooms?: boolean;
    verify_payments?: boolean;
    delete_reservations?: boolean;
    manage_qr?: boolean;
    view_accounting?: boolean;
  };
  must_change_password: number;
  last_seen?: string;
  last_seen_ts?: number;
  is_online?: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number;
  times_used: number;
  status: 'Active' | 'Inactive';
  created_at?: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  text: string;
}

export interface Settings {
  payment_qr_provider: string;
  payment_qr_name: string;
  payment_qr_number: string;
  payment_qr_url: string;
  checkout_time_overnight: string;
  checkout_time_dayuse: string;
  semaphore_api_key?: string;
  sms_confirm_template?: string;
  sms_reject_template?: string;
  [key: string]: string | undefined;
}

export interface RecoveryRequest {
  id: number;
  admin_id: string;
  staff_name: string;
  email: string;
  emp_id: string;
  note?: string;
  status: string;
  created_at: string;
}

export interface ConnectionConfig {
  backendUrl: string;
  isConnected: boolean;
  lastSyncTimestamp: number | null;
  syncStatus: 'idle' | 'syncing' | 'connected' | 'error';
  errorMessage: string | null;
  dbHost: string;
  dbName: string;
  dbUser: string;
  autoSync: boolean;
}
