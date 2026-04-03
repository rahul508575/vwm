<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

include "../../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

if ($email === '') {
  echo json_encode([
    "status" => false,
    "message" => "Email required"
  ]);
  exit;
}

$stmt = $conn->prepare(
  "SELECT name FROM users WHERE email = ? LIMIT 1"
);
$stmt->bind_param("s", $email);
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

echo json_encode([
  "status" => true,
  "name" => $user['name']
]);
