<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . "/../config/db.php";

/* ========= INPUT ========= */
$keyword = $_GET['keyword'] ?? '';
$type = $_GET['type'] ?? 'prod'; // prod OR comp

if (empty($keyword)) {
    echo json_encode([
        "status" => false,
        "message" => "Keyword required"
    ]);
    exit;
}

$key = "%" . $keyword . "%";

/* ========= PRODUCT SEARCH ========= */
if ($type == "prod") {

    $stmt = $conn->prepare("
        SELECT 
            p.id,
            p.name,
            p.image_name,
            c.id as comp_id,
            c.comp_name,
            c.comp_url,
            c.comp_city,
            c.comp_state_name
        FROM tbl_products p
        JOIN tbl_companies c ON p.comp_id = c.id
        WHERE p.status = 'Active' 
        AND p.name LIKE ?
        ORDER BY c.listing_priority DESC
    ");

    $stmt->bind_param("s", $key);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];

    while ($row = $result->fetch_assoc()) {

        $data[] = [
            "product_id" => (int)$row['id'],
            "product_name" => $row['name'],
            "image" => $row['image_name']
                ? "https://api.visionworldmart.com/backend/uploads/products/" . $row['image_name']
                : null,

            "company" => [
                "id" => (int)$row['comp_id'],
                "name" => $row['comp_name'],
                "city" => $row['comp_city'],
                "state" => $row['comp_state_name'],
                "url" => $row['comp_url']
            ]
        ];
    }

    echo json_encode([
        "status" => true,
        "total" => count($data),
        "data" => $data
    ]);
}

/* ========= COMPANY SEARCH ========= */
elseif ($type == "comp") {

    $stmt = $conn->prepare("
        SELECT id, comp_name, comp_profile, comp_url
        FROM tbl_companies
        WHERE comp_name LIKE ?
    ");

    $stmt->bind_param("s", $key);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];

    while ($row = $result->fetch_assoc()) {

        $data[] = [
            "company_id" => (int)$row['id'],
            "name" => $row['comp_name'],
            "profile" => strip_tags($row['comp_profile']),
            "url" => $row['comp_url']
        ];
    }

    echo json_encode([
        "status" => true,
        "total" => count($data),
        "data" => $data
    ]);
}