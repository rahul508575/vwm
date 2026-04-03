<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

include "../../config/db.php";

$id        = $_POST['id'] ?? '';
$name      = trim($_POST['product_name'] ?? '');
$category  = trim($_POST['category'] ?? '');
$price     = trim($_POST['price'] ?? '');
$min_qty   = trim($_POST['min_order_qty'] ?? '');
$desc      = trim($_POST['description'] ?? '');

if (!$id || !$name || !$category || !$price) {
  echo json_encode(["status" => false, "message" => "Required fields missing"]);
  exit;
}

$imageSql = "";
$imagePath = "";

if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
  $uploadDir = "../../uploads/products/";
  if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

  $imageName = time() . "_" . $_FILES['image']['name'];
  $target = $uploadDir . $imageName;

  if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
    $imagePath = "uploads/products/" . $imageName;
    $imageSql = ", image='$imagePath'";
  }
}

$sql = "UPDATE products SET
          product_name=?,
          category=?,
          price=?,
          min_order_qty=?,
          description=?
          $imageSql
        WHERE id=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
  "sssssi",
  $name,
  $category,
  $price,
  $min_qty,
  $desc,
  $id
);

if ($stmt->execute()) {
  echo json_encode(["status" => true, "message" => "Product updated"]);
} else {
  echo json_encode(["status" => false, "message" => "Update failed"]);
}
