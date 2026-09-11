<?php
/**
 * Grand Horizon Luxury Resort - Android Mobile App API Bridge for InfinityFree
 * 
 * Instructions:
 * 1. Upload this file to your InfinityFree domain's "htdocs" folder (e.g. htdocs/api.php)
 * 2. In this Android App, set the Backend URL to:
 *    http://yourdomain.infinityfreeapp.com/api.php
 */

// Enable CORS for Android Web / PWA App
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// InfinityFree Database Credentials
$db_host = "sql311.infinityfree.com";
$db_name = "if0_42682733_hotel_resort_db";
$db_user = "if0_42682733";
// Replace with your InfinityFree vPanel / hosting account password if needed:
$db_pass = isset($_ENV['DB_PASS']) ? $_ENV['DB_PASS'] : "Evergreen2026";

$conn = @new mysqli($db_host, $db_user, $db_pass, $db_name, 3306);

// Verify DB connection
$db_connected = true;
if ($conn->connect_error) {
    $db_connected = false;
    $db_error = $conn->connect_error;
} else {
    $conn->set_charset("utf8mb4");

    // Auto-create essential tables if they do not exist yet
    $conn->query("CREATE TABLE IF NOT EXISTS rooms (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'Available',
        units_count INT NOT NULL DEFAULT 1,
        capacity VARCHAR(100) DEFAULT '2 Guests',
        size VARCHAR(100) DEFAULT '35 m²',
        features TEXT,
        images TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $conn->query("CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        guest_name VARCHAR(255) NOT NULL,
        contact VARCHAR(100) NOT NULL,
        room_id VARCHAR(50) NOT NULL,
        room_title VARCHAR(255) NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        nights INT NOT NULL DEFAULT 1,
        guests_adults INT NOT NULL DEFAULT 1,
        guests_children INT NOT NULL DEFAULT 0,
        has_breakfast TINYINT(1) NOT NULL DEFAULT 0,
        breakfast_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
        total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
        downpayment_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        remaining_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
        arrival_time VARCHAR(50) DEFAULT '14:00',
        eta_extended TINYINT(1) DEFAULT 0,
        eta_note TEXT,
        ref_no VARCHAR(100) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'E-Wallet',
        payment_option VARCHAR(50) DEFAULT '50% Downpayment',
        status VARCHAR(100) NOT NULL DEFAULT 'Pending 1st Confirmation',
        coupon_code VARCHAR(50) DEFAULT NULL,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $conn->query("CREATE TABLE IF NOT EXISTS coupons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage',
        discount_value DECIMAL(10,2) NOT NULL DEFAULT 10,
        max_uses INT NOT NULL DEFAULT 100,
        times_used INT NOT NULL DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'Active'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $conn->query("CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Seed default coupons if empty
    $check_cpn = $conn->query("SELECT COUNT(*) as cnt FROM coupons");
    if ($check_cpn && ($row = $check_cpn->fetch_assoc()) && $row['cnt'] == 0) {
        $conn->query("INSERT IGNORE INTO coupons (code, discount_type, discount_value, max_uses, times_used, status) VALUES
            ('HORIZON2026', 'percentage', 15.00, 100, 0, 'Active'),
            ('BEACHFUN500', 'fixed', 500.00, 50, 0, 'Active'),
            ('WELCOME10', 'percentage', 10.00, 200, 0, 'Active');");
    }

    // Seed settings if empty
    $check_set = $conn->query("SELECT COUNT(*) as cnt FROM settings");
    if ($check_set && ($row = $check_set->fetch_assoc()) && $row['cnt'] == 0) {
        $conn->query("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
            ('payment_qr_provider', 'GCash / Maya'),
            ('payment_qr_name', 'Grand Horizon Luxury Resort Inc.'),
            ('payment_qr_number', '0917-888-9999'),
            ('payment_qr_url', 'https://api.qrserver.com/v1/create-qr-code/?data=GCASH-GRAND-HORIZON-RESORT-09178889999&size=300x300'),
            ('checkout_time_overnight', '12:00 PM (Noon)'),
            ('checkout_time_dayuse', '12:00 Midnight');");
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : (isset($_GET['api']) ? $_GET['api'] : '');

// 1. FETCH LIVE DATA (GET ?api=fetch_live_data or action=fetch_live_data)
if ($action === 'fetch_live_data' || $method === 'GET') {
    $rooms = [];
    $reservations = [];
    $coupons = [];
    $settings = [];

    if ($db_connected) {
        // Fetch rooms
        $r_res = $conn->query("SELECT * FROM rooms");
        if ($r_res) {
            while ($r = $r_res->fetch_assoc()) {
                $rooms[] = [
                    'id' => $r['id'],
                    'title' => $r['title'],
                    'category' => $r['category'],
                    'price' => floatval($r['price']),
                    'status' => $r['status'],
                    'units_count' => intval($r['units_count']),
                    'capacity' => $r['capacity'],
                    'size' => $r['size'],
                    'features' => json_decode($r['features']) ?: explode(',', $r['features']),
                    'images' => json_decode($r['images']) ?: explode("\n", $r['images'])
                ];
            }
        }

        // Fetch reservations
        $b_res = $conn->query("SELECT * FROM reservations ORDER BY id DESC LIMIT 100");
        if ($b_res) {
            while ($b = $b_res->fetch_assoc()) {
                $reservations[] = [
                    'id' => intval($b['id']),
                    'code' => $b['code'],
                    'guest_name' => $b['guest_name'],
                    'contact' => $b['contact'],
                    'room_id' => $b['room_id'],
                    'room_title' => $b['room_title'],
                    'check_in' => $b['check_in'],
                    'check_out' => $b['check_out'],
                    'nights' => intval($b['nights']),
                    'guests_adults' => intval($b['guests_adults']),
                    'guests_children' => intval($b['guests_children']),
                    'has_breakfast' => intval($b['has_breakfast']),
                    'breakfast_fee' => floatval($b['breakfast_fee']),
                    'total_price' => floatval($b['total_price']),
                    'downpayment_amount' => floatval($b['downpayment_amount']),
                    'remaining_balance' => floatval($b['remaining_balance']),
                    'arrival_time' => $b['arrival_time'],
                    'eta_extended' => intval($b['eta_extended']),
                    'eta_note' => $b['eta_note'],
                    'ref_no' => $b['ref_no'],
                    'payment_method' => $b['payment_method'],
                    'payment_option' => $b['payment_option'],
                    'status' => $b['status'],
                    'coupon_code' => $b['coupon_code'],
                    'discount_amount' => floatval($b['discount_amount']),
                    'created_at' => $b['created_at']
                ];
            }
        }

        // Fetch coupons
        $c_res = $conn->query("SELECT * FROM coupons WHERE status = 'Active'");
        if ($c_res) {
            while ($c = $c_res->fetch_assoc()) {
                $coupons[] = [
                    'id' => intval($c['id']),
                    'code' => $c['code'],
                    'discount_type' => $c['discount_type'],
                    'discount_value' => floatval($c['discount_value']),
                    'max_uses' => intval($c['max_uses']),
                    'times_used' => intval($c['times_used']),
                    'status' => $c['status']
                ];
            }
        }

        // Fetch settings
        $s_res = $conn->query("SELECT * FROM settings");
        if ($s_res) {
            while ($s = $s_res->fetch_assoc()) {
                $settings[$s['setting_key']] = $s['setting_value'];
            }
        }
    }

    echo json_encode([
        'status' => 'success',
        'db_connected' => $db_connected,
        'timestamp' => date('c'),
        'server' => 'InfinityFree MySQL Bridge',
        'rooms' => $rooms,
        'reservations' => $reservations,
        'coupons' => $coupons,
        'settings' => $settings
    ]);
    exit();
}

// 2. CREATE BOOKING FROM GUEST ANDROID APP
if ($action === 'create_booking' && $method === 'POST') {
    $guest_name = isset($_POST['guest_name']) ? trim($_POST['guest_name']) : '';
    $contact = isset($_POST['contact']) ? trim($_POST['contact']) : '';
    $room_id = isset($_POST['room_id']) ? trim($_POST['room_id']) : '';
    $check_in = isset($_POST['check_in']) ? trim($_POST['check_in']) : date('Y-m-d');
    $check_out = isset($_POST['check_out']) ? trim($_POST['check_out']) : date('Y-m-d', strtotime('+1 day'));
    $ref_no = isset($_POST['ref_no']) ? trim($_POST['ref_no']) : 'GCASH-MANUAL';
    $payment_option = isset($_POST['payment_option']) ? trim($_POST['payment_option']) : '50% Downpayment';
    $arrival_time = isset($_POST['arrival_time']) ? trim($_POST['arrival_time']) : '14:00';
    $has_breakfast = !empty($_POST['has_breakfast']) ? 1 : 0;
    $guests_adults = isset($_POST['guests_adults']) ? intval($_POST['guests_adults']) : 2;
    $guests_children = isset($_POST['guests_children']) ? intval($_POST['guests_children']) : 0;
    $coupon_code = isset($_POST['coupon_code']) ? trim($_POST['coupon_code']) : '';

    if (empty($guest_name) || empty($contact) || empty($room_id)) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required booking details.']);
        exit();
    }

    $code = 'RES-' . rand(100, 999);

    if ($db_connected) {
        $stmt = $conn->prepare("INSERT INTO reservations 
            (code, guest_name, contact, room_id, room_title, check_in, check_out, arrival_time, ref_no, payment_option, has_breakfast, guests_adults, guests_children, coupon_code, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending 1st Confirmation')");
        
        $room_title = "Resort Accommodation (" . $room_id . ")";
        $stmt->bind_param("sssssssssiisss", 
            $code, $guest_name, $contact, $room_id, $room_title, 
            $check_in, $check_out, $arrival_time, $ref_no, $payment_option, 
            $has_breakfast, $guests_adults, $guests_children, $coupon_code
        );
        $stmt->execute();
    }

    echo json_encode([
        'status' => 'success',
        'code' => $code,
        'message' => "Reservation $code created successfully."
    ]);
    exit();
}

// 3. EXTEND ETA FROM GUEST APP
if ($action === 'extend_eta' && $method === 'POST') {
    $code = isset($_POST['code']) ? trim($_POST['code']) : '';
    $new_eta = isset($_POST['new_eta']) ? trim($_POST['new_eta']) : '';
    $note = isset($_POST['eta_note']) ? trim($_POST['eta_note']) : 'Guest requested ETA extension via Mobile App';

    if ($db_connected && !empty($code)) {
        $stmt = $conn->prepare("UPDATE reservations SET arrival_time = ?, eta_extended = 1, eta_note = ? WHERE code = ?");
        $stmt->bind_param("sss", $new_eta, $note, $code);
        $stmt->execute();
    }

    echo json_encode([
        'status' => 'success',
        'message' => "ETA for $code updated to $new_eta."
    ]);
    exit();
}

// Fallback response
echo json_encode([
    'status' => 'ready',
    'service' => 'Grand Horizon Luxury Resort API',
    'db_connected' => $db_connected,
    'supported_actions' => ['fetch_live_data', 'create_booking', 'extend_eta']
]);
