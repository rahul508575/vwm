<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$seller_id = $_GET['seller_id'] ?? 0;

$sql = "SELECT COUNT(*) as unread 
        FROM enquiries 
        WHERE seller_id = ? AND is_read = 0";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $seller_id);
$stmt->execute();

$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode([
  "status" => true,
  "unread" => $row['unread']
]);
