<?php

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo 'Backend is ready.';
    exit;
}

// Allow CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
}
// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Headers: *");
}

$data = $_REQUEST;

header('Content-Type: application/json;charset=utf-8');

if (!empty($_FILES)) {
    move_uploaded_file($_FILES['files']['tmp_name'], __DIR__ . '/uploaded_file');
}

die(json_encode($data));
