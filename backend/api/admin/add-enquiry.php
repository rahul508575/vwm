<?php
error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["status"=>false,"message"=>"Invalid JSON"]);
  exit;
}

$seller_id = $data['seller_id'] ?? null;
$name      = $data['name'] ?? '';
$mobile    = $data['mobile'] ?? '';
$product   = $data['product'] ?? '';
$message   = $data['message'] ?? '';

$stmt = $conn->prepare("INSERT INTO enquiries (seller_id,name,mobile,product,message) VALUES (?,?,?,?,?)");

if (!$stmt) {
  echo json_encode(["status"=>false,"message"=>$conn->error]);
  exit;
}

$stmt->bind_param("issss", $seller_id, $name, $mobile, $product, $message);

if ($stmt->execute()) {
  echo json_encode(["status"=>true]);
} else {
  echo json_encode(["status"=>false,"message"=>$stmt->error]);
}