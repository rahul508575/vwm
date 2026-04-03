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

/* Collect Data */
$comp_id            = $data['comp_id'] ?? null;
$enquiry_name       = trim($data['enquiry_name'] ?? '');
$enquiry_comp_name  = trim($data['enquiry_comp_name'] ?? '');
$enquiry_mobile     = trim($data['enquiry_mobile'] ?? '');
$enquiry_email      = trim($data['enquiry_email'] ?? '');
$enquiry_address    = trim($data['enquiry_address'] ?? '');
$enquiry_subject    = trim($data['enquiry_subject'] ?? '');
$enquiry_detail     = trim($data['enquiry_detail'] ?? '');
$enquiry_source     = trim($data['enquiry_source'] ?? 'Mobile App');
$country_name       = trim($data['country_name'] ?? 'India');

$enquiry_add_date   = date("Y-m-d");

/* Validation */
if (!$enquiry_name || !$enquiry_mobile || !$enquiry_email) {
  echo json_encode([
    "status" => false,
    "message" => "Name, Mobile & Email are required"
  ]);
  exit;
}

/* Insert Query */
$sql = "
INSERT INTO tbl_enquiry
(
  comp_id,
  enquiry_name,
  enquiry_comp_name,
  enquiry_mobile,
  enquiry_email,
  enquiry_address,
  enquiry_subject,
  enquiry_detail,
  enquiry_source,
  enquiry_add_date,
  enquiry_status,
  country_name
)
VALUES (?,?,?,?,?,?,?,?,?,?,'Active',?)
";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
  "issssssssss",
  $comp_id,
  $enquiry_name,
  $enquiry_comp_name,
  $enquiry_mobile,
  $enquiry_email,
  $enquiry_address,
  $enquiry_subject,
  $enquiry_detail,
  $enquiry_source,
  $enquiry_add_date,
  $country_name
);

if ($stmt->execute()) {
  echo json_encode([
    "status" => true,
    "message" => "Enquiry submitted successfully"
  ]);
} else {
  echo json_encode([
    "status" => false,
    "message" => "Failed to submit enquiry"
  ]);
}
