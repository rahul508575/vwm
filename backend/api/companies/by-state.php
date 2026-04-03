<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$state = $_GET['state'] ?? '';

if (!$state) {
  echo json_encode([
    "status" => false,
    "message" => "State is required"
  ]);
  exit;
}

$stmt = $conn->prepare("
  SELECT 
    id,
    comp_name,
    comp_logo,
    comp_city,
    comp_state_name,
    business_type,
    membership,
    comp_gst
  FROM tbl_companies
  WHERE comp_state_name = ?
    AND comp_status = 'Active'
  ORDER BY comp_order_by DESC
");

$stmt->bind_param("s", $state);
$stmt->execute();
$res = $stmt->get_result();

$companies = [];

while ($row = $res->fetch_assoc()) {
  $row['logo'] = $row['comp_logo']
    ? "https://api.visionworldmart.com/backend/uploads/comp_logo/" . $row['comp_logo']
    : null;

  $companies[] = $row;
}

echo json_encode([
  "status" => true,
  "companies" => $companies
]);
