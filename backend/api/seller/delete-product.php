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

$product_id = $data['id'] ?? '';

if (!$product_id) {
  echo json_encode([
    "status" => false,
    "message" => "Product ID required"
  ]);
  exit;
}

// 🔹 Get image path first
$get = $conn->prepare("SELECT image FROM products WHERE id=?");
$get->bind_param("i", $product_id);
$get->execute();
$res = $get->get_result();

if ($res->num_rows === 0) {
  echo json_encode([
    "status" => false,
    "message" => "Product not found"
  ]);
  exit;
}

$row = $res->fetch_assoc();
$imagePath = $row['image'];

// 🔹 Delete product from DB
$del = $conn->prepare("DELETE FROM products WHERE id=?");
$del->bind_param("i", $product_id);

if ($del->execute()) {
  // 🔹 Delete image file
  if ($imagePath) {
    $fullPath = "../../" . $imagePath;
    if (file_exists($fullPath)) {
      unlink($fullPath);
    }
  }

  echo json_encode([
    "status" => true,
    "message" => "Product deleted successfully"
  ]);
} else {
  echo json_encode([
    "status" => false,
    "message" => "Delete failed"
  ]);
}
