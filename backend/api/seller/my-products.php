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

$result = $conn->prepare(
  "SELECT id, product_name, price, image
   FROM products
   WHERE seller_id = ?
   ORDER BY id DESC"
);

$result->bind_param("i", $seller_id);
$result->execute();

$res = $result->get_result();

$products = [];

while ($row = $res->fetch_assoc()) {
  $products[] = [
    "id" => $row['id'],
    "name" => $row['product_name'],
    "price" => $row['price'],
    "status" => "Active",
    "image" => $row['image']
      ? "https://api.visionworldmart.com/backend/" . $row['image']
      : "https://via.placeholder.com/100"
  ];
}

echo json_encode([
  "status" => true,
  "products" => $products
]);
