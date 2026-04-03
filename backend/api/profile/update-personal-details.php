<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

include "../../config/db.php";

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['id'] ?? '';
$name    = trim($data['name'] ?? '');
$mobile  = trim($data['mobile'] ?? '');
$email   = trim($data['email'] ?? '');

if (!$user_id || !$name || !$mobile || !$email) {
  echo json_encode([
    "status" => false,
    "message" => "All fields are required"
  ]);
  exit;
}

// Update users table
$stmt = $conn->prepare(
  "UPDATE users 
   SET name = ?, mobile = ?, email = ?
   WHERE id = ?"
);

$stmt->bind_param(
  "sssi",
  $name,
  $mobile,
  $email,
  $user_id
);

if ($stmt->execute()) {
  echo json_encode([
    "status" => true,
    "message" => "Personal details updated successfully"
  ]);
} else {
  echo json_encode([
    "status" => false,
    "message" => "Update failed"
  ]);
}
