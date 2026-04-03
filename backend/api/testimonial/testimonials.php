<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$result = $conn->query("
  SELECT 
    test_id,
    test_given_by,
    test_comp_name,
    test_description,
    test_image_name
  FROM tbl_testimonial
  WHERE test_status = 'Active'
  ORDER BY test_order_by ASC
");

$testimonials = [];

while ($row = $result->fetch_assoc()) {
  $testimonials[] = [
    "id" => $row["test_id"],
    "name" => $row["test_given_by"],
    "company" => $row["test_comp_name"],
    "message" => $row["test_description"],
    "image" => $row["test_image_name"]
      ? "https://api.visionworldmart.com/backend/uploads/testimonial/" . $row["test_image_name"]
      : null
  ];
}

echo json_encode([
  "status" => true,
  "data" => $testimonials
]);
