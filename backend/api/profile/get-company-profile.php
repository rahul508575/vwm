<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
  echo json_encode([
    "status" => false,
    "message" => "User ID required"
  ]);
  exit;
}

$stmt = $conn->prepare(
  "SELECT id, name, email, mobile, company_id, company_name, membership
   FROM users
   WHERE id = ?"
);

$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
  echo json_encode(["status" => false]);
  exit;
}

echo json_encode([
  "status" => true,
  "profile" => $res->fetch_assoc()
]);
