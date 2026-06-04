<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$sql = "SELECT * FROM enquiries ORDER BY id DESC";
$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode([
  "status" => true,
  "data" => $data
]);