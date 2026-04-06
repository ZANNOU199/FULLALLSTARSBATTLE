<?php
// Test direct POST to Laravel API from PHP

$data = [
    'name' => 'Test Direct POST',
    'country' => 'France',
    'category' => 'b-boy',
    'specialty' => 'Breaking',
    'bio' => 'Test participant from PHP',
    'photo' => '',
    'countryCode' => 'fr',
];

$ch = curl_init('http://localhost:8000/api/cms/participants');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

echo "Sending POST request to /api/cms/participants\n";
echo "Data: " . json_encode($data) . "\n\n";

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "HTTP Status: " . $httpCode . "\n";
echo "Response: " . $response . "\n";

curl_close($ch);

// Now check database
echo "\n--- Checking database ---\n";
$pdo = new PDO("mysql:host=127.0.0.1;dbname=allstarsbattle;charset=utf8mb4", "root", "12345");
$stmt = $pdo->query('SELECT COUNT(*) as total FROM participants');
$result = $stmt->fetch(PDO::FETCH_ASSOC);
echo "Total participants in DB: " . $result['total'] . "\n";
?>
