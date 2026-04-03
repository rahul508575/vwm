<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$seller_id = $_GET['seller_id'] ?? '';

if (!$seller_id) {
  echo json_encode([
    "status" => false,
    "message" => "Seller ID required"
  ]);
  exit;
}

// 🔹 Count Products
$pstmt = $conn->prepare(
  "SELECT COUNT(*) as total_products FROM products WHERE seller_id=?"
);
$pstmt->bind_param("i", $seller_id);
$pstmt->execute();
$productsCount = $pstmt->get_result()->fetch_assoc()['total_products'] ?? 0;

// 🔹 Count Inquiries
$istmt = $conn->prepare(
  "SELECT COUNT(*) as total_inquiries FROM inquiries WHERE seller_id=?"
);
$istmt->bind_param("i", $seller_id);
$istmt->execute();
$inquiriesCount = $istmt->get_result()->fetch_assoc()['total_inquiries'] ?? 0;

echo json_encode([
  "status" => true,
  "products" => (int)$productsCount,
  "inquiries" => (int)$inquiriesCount
]);
