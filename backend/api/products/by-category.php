<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$category_id = $_GET['category_id'] ?? '';

if (!$category_id) {
  echo json_encode([
    "status" => false,
    "message" => "Category ID required"
  ]);
  exit;
}

$sql = "
SELECT 
  p.id,
  p.name,
  p.price,
  p.image_name,
  p.t1,
  p.t2,
  p.b1,
  p.b2,

  c.comp_name,
  c.comp_city,
  c.comp_state_name,
  c.comp_country_name,
  c.membership,
  c.comp_gst,
  c.business_type,
  c.year_of_establish,
  c.name,
  c.comp_mobile
FROM tbl_products p
JOIN tbl_companies c ON c.id = p.comp_id
WHERE p.status = 'Active'
AND c.comp_status = 'Active'
AND p.finalcat_id = ?
ORDER BY p.id DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $category_id);
$stmt->execute();

$result = $stmt->get_result();

$products = [];

while ($row = $result->fetch_assoc()) {

  $row['image'] = $row['image_name']
    ? "https://api.visionworldmart.com/backend/uploads/category/" . $row['image_name']
    : "https://via.placeholder.com/100";

  $products[] = $row;
}

echo json_encode([
  "status" => true,
  "products" => $products
]);
