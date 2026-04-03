<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
  echo json_encode(["status" => false]);
  exit;
}

$stmt = $conn->prepare(
  "SELECT company_name, gstin, pan, address
   FROM business_profiles
   WHERE user_id = ?"
);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
  echo json_encode([
    "status" => true,
    "business" => []
  ]);
  exit;
}

echo json_encode([
  "status" => true,
  "business" => $res->fetch_assoc()
]);
