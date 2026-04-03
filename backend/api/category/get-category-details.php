<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$parent_id = $_GET['category_id'] ?? '';

if (!$parent_id) {
  echo json_encode([
    "status" => false,
    "message" => "Category ID required"
  ]);
  exit;
}

/* Main category */
$cat = $conn->prepare(
  "SELECT category_id, category_name, category_image_name 
   FROM tbl_category 
   WHERE category_id=? AND category_status='Active'"
);
$cat->bind_param("i", $parent_id);  
$cat->execute();
$catRes = $cat->get_result();

if ($catRes->num_rows === 0) {
  echo json_encode(["status" => false, "message" => "Category not found"]);
  exit;
}

$category = $catRes->fetch_assoc();

/* Sub categories */
$sub = $conn->prepare(
  "SELECT category_id, category_name 
   FROM tbl_category 
   WHERE category_parent_id=? AND category_status='Active'
   ORDER BY category_order_by ASC"
);
$sub->bind_param("i", $parent_id);
$sub->execute();
$subRes = $sub->get_result();

$subs = [];
while ($row = $subRes->fetch_assoc()) {
  $subs[] = $row;
}

echo json_encode([
  "status" => true,
  "category" => [
    "id" => $category['category_id'],
    "name" => $category['category_name'],
    "image" => $category['category_image_name']
      ? "https://api.visionworldmart.com/backend/uploads/category/" . $category['category_image_name']
      : null
  ],
  "subcategories" => $subs
]);
