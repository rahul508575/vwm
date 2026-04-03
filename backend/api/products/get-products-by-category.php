<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

// 🔹 category_id React Native se aayega
$category_id = $_GET['category_id'] ?? '';

if (!$category_id) {
  echo json_encode([
    "status" => false,
    "message" => "Category ID required"
  ]);
  exit;
}

// 🔹 Products query (same logic as web)
$sql = "
SELECT 
  p.id,
  p.name,
  p.price,
  p.image_name,
  p.category_description,
  p.url,
  c.comp_name,
  c.comp_url,
  c.membership
FROM tbl_products p
LEFT JOIN tbl_companies c ON c.id = p.comp_id
WHERE p.status='Active'
AND p.finalcat_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $category_id);
$stmt->execute();
$result = $stmt->get_result();

$products = [];

while ($row = $result->fetch_assoc()) {
  $products[] = [
    "id" => $row['id'],
    "name" => $row['name'],
    "price" => $row['price'],
    "image" => "https://api.visionworldmart.com/backend/uploads/category/" . $row['image_name'],
    "company_name" => $row['comp_name'],
    "company_url" => $row['comp_url'],
    "membership" => $row['membership'],
    "description" => strip_tags($row['category_description']),
    "product_url" => $row['url']
  ];
}

echo json_encode([
  "status" => true,
  "data" => $products
]);
