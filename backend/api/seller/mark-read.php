<?php
header("Content-Type: application/json");
include "../../config/db.php";

$id = $_POST['id'] ?? '';

if (!$id) {
  echo json_encode(["status"=>false,"message"=>"ID required"]);
  exit;
}

$stmt = $conn->prepare("UPDATE enquiries SET is_read = 1 WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["status"=>true]);