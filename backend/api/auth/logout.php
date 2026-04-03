<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Agar future me session/JWT add karoge
// yahin invalidate logic aayega

echo json_encode([
    "status" => true,
    "message" => "Logout successful"
]);
