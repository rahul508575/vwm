<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$seller_id = $_GET['seller_id'] ?? '';
if (!$seller_id) {
  echo json_encode(["status" => false, "message" => "Seller ID required"]);
  exit;
}

$data = [];
for ($i = 5; $i >= 0; $i--) {
  $month = date("m", strtotime("-$i months"));
  $year  = date("Y", strtotime("-$i months"));
  $label = date("M", strtotime("-$i months"));

  // Products
  $p = $conn->prepare("
    SELECT COUNT(*) as total 
    FROM products 
    WHERE seller_id=? 
    AND MONTH(created_at)=? 
    AND YEAR(created_at)=?
  ");
  $p->bind_param("iii", $seller_id, $month, $year);
  $p->execute();
  $products = $p->get_result()->fetch_assoc()['total'];

  // Inquiries
  $q = $conn->prepare("
    SELECT COUNT(*) as total 
    FROM inquiries 
    WHERE seller_id=? 
    AND MONTH(created_at)=? 
    AND YEAR(created_at)=?
  ");
  $q->bind_param("iii", $seller_id, $month, $year);
  $q->execute();
  $inquiries = $q->get_result()->fetch_assoc()['total'];

  $data[] = [
    "month" => $label,
    "products" => (int)$products,
    "inquiries" => (int)$inquiries
  ];
}

echo json_encode([
  "status" => true,
  "analytics" => $data
]);
