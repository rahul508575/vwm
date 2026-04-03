<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

include "../config/db.php";

$type = $_GET['type'] ?? '';
$q    = $_GET['q'] ?? '';

if (empty($type) || empty($q)) {
    echo json_encode([
        "status" => false,
        "data" => [],
        "message" => "Missing parameters"
    ]);
    exit;
}

$key = "%" . $q . "%";

$productImageBase = "https://api.visionworldmart.com/backend/uploads/products/";

/* ================= PRODUCTS ================= */
if ($type === "products") {

    $stmt = $conn->prepare("
        SELECT 
            tbl_products.id,
            tbl_products.name AS product_name,
            tbl_products.image_name,
            tbl_products.url,
            tbl_companies.comp_name,
            tbl_companies.comp_city,
            tbl_companies.comp_state_name,
            tbl_companies.comp_url,
            tbl_companies.membership
        FROM tbl_products
        JOIN tbl_companies ON tbl_products.comp_id = tbl_companies.id
        WHERE tbl_products.status = 'Active'
          AND tbl_products.name LIKE ?
        ORDER BY tbl_companies.listing_priority DESC
    ");
    $stmt->bind_param("s", $key);
}

/* ================= COMPANIES ================= */
elseif ($type === "companies") {

    $stmt = $conn->prepare("
        SELECT 
            id,
            comp_name,
            comp_city,
            comp_state_name,
            comp_logo,
            comp_profile,
            membership,
            name
        FROM tbl_companies
        WHERE comp_name LIKE ?
    ");
    $stmt->bind_param("s", $key);
}

/* ================= BUY LEADS ================= */
elseif ($type === "buy-leads") {

    $stmt = $conn->prepare("
        SELECT 
            id,
            offer_title AS product_name,
            qty,
            unit,
            country AS location,
            description
        FROM tbl_offers
        WHERE status = 'Active'
          AND offer_title LIKE ?
    ");
    $stmt->bind_param("s", $key);
}

else {
    echo json_encode(["status" => false, "data" => []]);
    exit;
}

/* ================= EXECUTE ================= */
$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {

    // ✅ Only for products
    if ($type === "products") {
        $row['image'] = !empty($row['image_name'])
            ? $productImageBase . $row['image_name']
            : null;
            $row['name'] = $row['product_name'];

        unset($row['image_name']); 
    }elseif ($type === 'companies'){
    $row['image'] = $row['comp_logo']
    ? "https://api.visionworldmart.com/backend/uploads/comp_logo/" . $row['comp_logo']
    : null;
    $row['name'] = $row['name'];
        unset($row['comp_logo']); 
    }

    $data[] = $row;
}

echo json_encode([
    "status" => true,
    "data" => $data
]);
