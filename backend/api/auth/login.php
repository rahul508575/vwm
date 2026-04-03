<?php
// ===============================
// HEADERS
// ===============================
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ===============================
// DB CONNECTION
// ===============================
include "../../config/db.php";

// ===============================
// READ JSON INPUT
// ===============================
$data = json_decode(file_get_contents("php://input"), true);

$login    = trim($data['login'] ?? ''); // email OR mobile
$password = $data['password'] ?? '';

// ===============================
// VALIDATION
// ===============================
if ($login === '' || $password === '') {
    echo json_encode([
        "status" => false,
        "message" => "Login and password are required"
    ]);
    exit;
}

// ===============================
// FETCH USER (EMAIL OR MOBILE)
// ===============================
$stmt = $conn->prepare(
    "SELECT id, name, email, mobile, password, role
     FROM users
     WHERE email = ? OR mobile = ?
     LIMIT 1"
);
$stmt->bind_param("ss", $login, $login);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => false,
        "message" => "User not found"
    ]);
    exit;
}

$user = $result->fetch_assoc();

// ===============================
// VERIFY PASSWORD
// ===============================
if (!password_verify($password, $user['password'])) {
    echo json_encode([
        "status" => false,
        "message" => "Invalid password"
    ]);
    exit;
}

// ===============================
// LOGIN SUCCESS
// ===============================
echo json_encode([
    "status" => true,
    "message" => "Login successful",
    "user" => [
        "id"     => $user['id'],
        "name"   => $user['name'],
        "email"  => $user['email'],
        "mobile" => $user['mobile'],
        "role"   => $user['role']
    ]
]);
