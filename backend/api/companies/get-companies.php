<?php
// ===============================
// HEADERS
// ===============================
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// ===============================
// DB CONNECTION
// ===============================
include "../../config/db.php";

// ===============================
// FETCH COMPANIES
// ===============================
$companies = [];

$query = "SELECT id, comp_name FROM tbl_companies WHERE comp_status='Active' ORDER BY comp_name ASC";
$result = $conn->query($query);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $companies[] = [
            "id" => $row["id"],
            "comp_name" => $row["comp_name"]
        ];
    }

    echo json_encode([
        "status" => true,
        "companies" => $companies
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Failed to fetch companies"
    ]);
}

$conn->close();