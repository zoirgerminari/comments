<?php
// Sistema de Comentários - API Principal
// Este arquivo força o Railway a detectar PHP

// Headers CORS
header('Access-Control-Allow-Origin: https://zoirgerminari.github.io');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include da API principal
require_once 'api-comments.php';
?>
