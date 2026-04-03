<?php
// ===============================
// HEADERS (LOCAL IP + RN FRIENDLY)
// ===============================
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS preflight (VERY IMPORTANT)
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

$name     = trim($data['name'] ?? '');
$email    = trim($data['email'] ?? '');
$mobile   = trim($data['mobile'] ?? '');
$password = $data['password'] ?? '';
$role     = $data['role'] ?? 'buyer';

// ===============================
// VALIDATION
// ===============================
if ($name === '' || $email === '' || $password === '') {
    echo json_encode([
        "status" => false,
        "message" => "Name, Email and Password are required"
    ]);
    exit;
}

// ===============================
// CHECK EMAIL
// ===============================
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "status" => false,
        "message" => "Email already registered"
    ]);
    exit;
}

// ===============================
// HASH PASSWORD
// ===============================
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// ===============================
// INSERT USER
// ===============================
$stmt = $conn->prepare(
    "INSERT INTO users (name, email, mobile, password, role)
     VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sssss",
    $name,
    $email,
    $mobile,
    $hashedPassword,
    $role
);

if ($stmt->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "Signup successful"
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Signup failed",
        "error" => $stmt->error
    ]);
}
