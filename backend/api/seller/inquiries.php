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

$stmt = $conn->prepare(
  "SELECT id, buyer_name, product_name, quantity, message, status, created_at
   FROM inquiries
   WHERE seller_id = ?
   ORDER BY id DESC"
);

$stmt->bind_param("i", $seller_id);
$stmt->execute();
$res = $stmt->get_result();

$inquiries = [];

while ($row = $res->fetch_assoc()) {
  $inquiries[] = [
    "id" => $row['id'],
    "buyerName" => $row['buyer_name'],
    "product" => $row['product_name'],
    "quantity" => $row['quantity'],
    "message" => $row['message'],
    "status" => $row['status'],
    "date" => date("d M Y", strtotime($row['created_at']))
  ];
}

echo json_encode([
  "status" => true,
  "inquiries" => $inquiries
]);
