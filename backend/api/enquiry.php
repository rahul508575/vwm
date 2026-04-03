<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"), true);

$product = $data['product_name'] ?? '';
$company = $data['company_name'] ?? '';
$name = $data['customer_name'] ?? '';
$mobile = $data['customer_mobile'] ?? '';
$message = $data['enquiry_message'] ?? '';

if (!$name || !$mobile || !$message) {
  echo json_encode([
    "status" => "error",
    "message" => "Invalid data"
  ]);
  exit;
}

$to = "info@visionworldmart.com";
$subject = "New Product Enquiry - VisionWorldMart";

$emailMessage = "
New Enquiry Received

Product: $product
Company: $company

Customer Name: $name
Mobile: $mobile

Message:
$message
";

$headers = "From: VisionWorldMart <noreply@visionworldmart.com>";

if (mail($to, $subject, $emailMessage, $headers)) {
  echo json_encode([
    "status" => "success",
    "message" => "Email sent"
  ]);
} else {
  echo json_encode([
    "status" => "error",
    "message" => "Email failed"
  ]);
}
