<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$id = $_GET['id'] ?? '';

if (!$id) {
  echo json_encode(["status" => false, "message" => "Product ID required"]);
  exit;
}

$stmt = $conn->prepare(
  "SELECT id, product_name, category, price, min_order_qty, description, image
   FROM products WHERE id = ?"
);
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
  echo json_encode(["status" => false, "message" => "Product not found"]);
  exit;
}

$row = $res->fetch_assoc();

echo json_encode([
  "status" => true,
  "product" => [
    "id" => $row['id'],
    "name" => $row['product_name'],
    "category" => $row['category'],
    "price" => $row['price'],
    "moq" => $row['min_order_qty'],
    "description" => $row['description'],
    "image" => $row['image']
      ? "https://api.visionworldmart.com/backend/" . $row['image']
      : ""
  ]
]);
