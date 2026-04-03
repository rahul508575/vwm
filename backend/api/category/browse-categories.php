<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$ROOT_PARENT_ID = 360;

$categories = [];

/* 1️⃣ Fetch MAIN categories */
$main = $conn->prepare("
  SELECT category_id, category_name, category_image_name
  FROM tbl_category
  WHERE category_parent_id = ?
    AND category_status = 'Active'
  ORDER BY category_order_by ASC
");
$main->bind_param("i", $ROOT_PARENT_ID);
$main->execute();
$mainRes = $main->get_result();

while ($row = $mainRes->fetch_assoc()) {

  /* 2️⃣ Fetch SUB categories (WITH IMAGE) */
  $sub = $conn->prepare("
    SELECT category_id, category_name, category_image_name
    FROM tbl_category
    WHERE category_parent_id = ?
      AND category_status = 'Active'
    ORDER BY category_order_by ASC
    LIMIT 12
  ");
  $sub->bind_param("i", $row['category_id']);
  $sub->execute();
  $subRes = $sub->get_result();

  $subs = [];
  while ($s = $subRes->fetch_assoc()) {
    $subs[] = [
      "category_id" => $s['category_id'],
      "category_name" => $s['category_name'],
      "image" => $s['category_image_name']
        ? "https://api.visionworldmart.com/backend/uploads/category/".$s['category_image_name']
        : null
    ];
  }

  $categories[] = [
    "id" => $row['category_id'],
    "name" => $row['category_name'],
    "image" => $row['category_image_name']
      ? "https://api.visionworldmart.com/backend/uploads/category/".$row['category_image_name']
      : null,
    "subcategories" => $subs
  ];
}

echo json_encode([
  "status" => true,
  "categories" => $categories
]);
