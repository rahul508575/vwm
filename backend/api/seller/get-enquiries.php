<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$company_id = $_GET['seller_id'] ?? '';

if (!$company_id) {
  echo json_encode([
    "status" => false,
    "message" => "seller_id required"
  ]);
  exit;
}

$stmt = $conn->prepare("
  SELECT 
    id,
    company_id,
    company_name,
    name,
    mobile,
    product,
    message,
    is_read,
    created_at
  FROM enquiries
  WHERE company_id = ?
  ORDER BY id DESC
");

$stmt->bind_param("i", $company_id);
$stmt->execute();

$res = $stmt->get_result();

$enquiries = [];

while ($row = $res->fetch_assoc()) {
  $enquiries[] = $row;
}

echo json_encode([
  "status" => true,
  "enquiries" => $enquiries
]);