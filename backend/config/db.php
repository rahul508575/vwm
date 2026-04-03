<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "visionworldmart";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode([
        "status" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}
