<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

ini_set('display_errors', 0);
error_reporting(0);

require_once __DIR__ . "/../config/db.php";

/* ================= VALIDATE ================= */
$company_id = $_GET['company_id'] ?? '';

if (!$company_id || !is_numeric($company_id)) {
    echo json_encode([
        "status" => false,
        "message" => "Invalid company id"
    ]);
    exit;
}

/* ================= COMPANY ================= */
$stmt = $conn->prepare("
    SELECT 
        id,
        comp_name,
        comp_profile,
        business_type,
        year_of_establish,
        comp_gst,
        no_of_employee,
        turnover,
        dealing,
        comp_mobile,
        banner,
        banner_sec,
        banner_third,
        slider_caption,
        slider_sec_caption,
        slider_third_caption,
        slider_desc
    FROM tbl_companies
    WHERE id = ? AND comp_status = 'Active'
    LIMIT 1
");

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => "Query error",
    ]);
    exit;
}

$stmt->bind_param("i", $company_id);
$stmt->execute();
$company = $stmt->get_result()->fetch_assoc();

if (!$company) {
    echo json_encode([
        "status" => false,
        "message" => "Company not found"
    ]);
    exit;
}

/* ================= SLIDER ================= */
$slider = [];

$base = "https://api.visionworldmart.com/backend/uploads/comp_logo/";

if (!empty($company['banner'])) {
    $slider[] = [
        "image" => $base . $company['banner'],
        "title" => $company['slider_caption'],
        "desc"  => $company['slider_desc']
    ];
}

if (!empty($company['banner_sec'])) {
    $slider[] = [
        "image" => $base . $company['banner_sec'],
        "title" => $company['slider_sec_caption'],
        "desc"  => $company['slider_desc']
    ];
}

if (!empty($company['banner_third'])) {
    $slider[] = [
        "image" => $base . $company['banner_third'],
        "title" => $company['slider_third_caption'],
        "desc"  => $company['slider_desc']
    ];
}

/* ================= PRODUCTS ================= */
$stmt = $conn->prepare("
    SELECT id, name, image_name
    FROM tbl_products
    WHERE status = 'Active' AND comp_id = ?
");

$stmt->bind_param("i", $company_id);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
$gallery  = [];

while ($row = $result->fetch_assoc()) {
    $img = $row['image_name']
        ? "https://api.visionworldmart.com/backend/uploads/products/" . $row['image_name']
        : null;

    $products[] = [
        "id" => (int)$row['id'],
        "name" => $row['name'],
        "image" => $img
    ];

    if ($img) {
        $gallery[] = $img;
    }
}

/* ================= RESPONSE ================= */
echo json_encode([
    "status" => true,
    "company" => [
        "id" => $company['id'],
        "name" => $company['comp_name'],
        "profile" => $company['comp_profile'],
        "business_type" => $company['business_type'],
        "year_of_establish" => $company['year_of_establish'],
        "gst" => $company['comp_gst'],
        "employees" => $company['no_of_employee'],
        "turnover" => $company['turnover'],
        "market" => $company['dealing'],
        "phone" => $company['comp_mobile']
    ],
    "slider" => $slider,
    "products" => $products,
    "gallery" => array_slice($gallery, 0, 4)
]);
