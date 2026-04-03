<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

include "../config/db.php";

/* ================= INPUT ================= */
$company_id = $_GET['company_id'] ?? '';

if (empty($company_id)) {
  echo json_encode([
    "status" => false,
    "message" => "company_id required"
  ]);
  exit;
}

/* ================= COMPANY DETAILS ================= */
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

    banner,
    banner_sec,
    banner_third,

    slider_caption,
    slider_sec_caption,
    slider_third_caption,
    slider_desc
  FROM tbl_companies
  WHERE id = ? AND comp_status = 'Active'
");
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

/* ================= SLIDER DATA ================= */
$slider = [];

if (!empty($company['banner'])) {
  $slider[] = [
    "image" => "https://api.visionworldmart.com/company_logo/" . $company['banner'],
    "title" => $company['slider_caption'],
    "desc"  => $company['slider_desc'],
    "cta"   => "Browse Products"
  ];
}

if (!empty($company['banner_sec'])) {
  $slider[] = [
    "image" => "https://api.visionworldmart.com/company_logo/" . $company['banner_sec'],
    "title" => $company['slider_sec_caption'],
    "desc"  => $company['slider_desc'],
    "cta"   => "Read About Profile"
  ];
}

if (!empty($company['banner_third'])) {
  $slider[] = [
    "image" => "https://api.visionworldmart.com/company_logo/" . $company['banner_third'],
    "title" => $company['slider_third_caption'],
    "desc"  => $company['slider_desc'],
    "cta"   => "Contact With Us"
  ];
}

/* ================= PRODUCTS ================= */
$stmt = $conn->prepare("
  SELECT 
    id,
    name,
    image_name,
    url
  FROM tbl_products
  WHERE status = 'Active' AND comp_id = ?
  ORDER BY id DESC
");
$stmt->bind_param("i", $company_id);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
$gallery  = [];

while ($row = $result->fetch_assoc()) {

  $img = $row['image_name']
    ? "https://api.visionworldmart.com/uploaded_files/" . $row['image_name']
    : null;

  $products[] = [
    "id"    => $row['id'],
    "name"  => $row['name'],
    "image" => $img,
    "url"   => $row['url']
  ];

  if ($img) {
    $gallery[] = $img;
  }
}

/* ================= FINAL RESPONSE ================= */
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
  ],
  "slider" => $slider,
  "products" => $products,
  "gallery" => array_slice($gallery, 0, 4)
]);
