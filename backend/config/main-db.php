<?php
$host = "localhost";
$user = "u182842532_vwm";
$pass = "Nagar@#789";
$db   = "u182842532_vwm";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode([
        "status" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}