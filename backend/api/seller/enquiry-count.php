<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$seller_id = $_GET['seller_id'] ?? '';

if (!$seller_id) {
  echo json_encode(["status" => false, "message" => "Seller ID required"]);
  exit;
}

$sql = "
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN is_read='No' THEN 1 ELSE 0 END) as unread
FROM tbl_enquiry
WHERE comp_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $seller_id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();

echo json_encode([
  "status" => true,
  "total" => (int)$res['total'],
  "unread" => (int)$res['unread']
]);
