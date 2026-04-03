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

$user_id = $data['user_id'] ?? '';
$company = trim($data['company_name'] ?? '');
$gstin   = trim($data['gstin'] ?? '');
$pan     = trim($data['pan'] ?? '');
$address = trim($data['address'] ?? '');

if (!$user_id || !$company) {
  echo json_encode([
    "status" => false,
    "message" => "Company name required"
  ]);
  exit;
}

// 🔹 Insert or Update
$stmt = $conn->prepare(
  "INSERT INTO business_profiles (user_id, company_name, gstin, pan, address)
   VALUES (?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE
     company_name = VALUES(company_name),
     gstin = VALUES(gstin),
     pan = VALUES(pan),
     address = VALUES(address)"
);

$stmt->bind_param("issss", $user_id, $company, $gstin, $pan, $address);

if ($stmt->execute()) {
  echo json_encode(["status" => true]);
} else {
  echo json_encode(["status" => false]);
}
