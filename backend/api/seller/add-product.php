<?php
// 🔒 Error handling (HTML output band)
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

include "../../config/db.php";

// ✅ FORM DATA se values lo (JSON nahi)
$seller_id = $_POST['seller_id'] ?? '';
$name      = trim($_POST['product_name'] ?? '');
$category  = trim($_POST['category'] ?? '');
$price     = trim($_POST['price'] ?? '');
$min_qty   = trim($_POST['min_order_qty'] ?? '');
$desc      = trim($_POST['description'] ?? '');

if (!$seller_id || !$name || !$category || !$price) {
  echo json_encode([
    "status" => false,
    "message" => "Required fields missing"
  ]);
  exit;
}

// 📂 Image upload handling
$imagePath = "";

if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
  $uploadDir = "../../uploads/products/";

  // Folder nahi hai to banao
  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
  }

  $imageName = time() . "_" . basename($_FILES['image']['name']);
  $targetFile = $uploadDir . $imageName;

  if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
    // DB me relative path save karenge
    $imagePath = "uploads/products/" . $imageName;
  } else {
    echo json_encode([
      "status" => false,
      "message" => "Image upload failed"
    ]);
    exit;
  }
}

// 🧠 SQL insert (image column included)
$stmt = $conn->prepare(
  "INSERT INTO products
   (seller_id, product_name, category, price, min_order_qty, description, image)
   VALUES (?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
  "issssss",
  $seller_id,
  $name,
  $category,
  $price,
  $min_qty,
  $desc,
  $imagePath
);

if ($stmt->execute()) {
  echo json_encode([
    "status" => true,
    "message" => "Product added successfully"
  ]);
} else {
  echo json_encode([
    "status" => false,
    "message" => "Failed to add product"
  ]);
}
