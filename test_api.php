<?php
$ch = curl_init('http://localhost:8000/api/upload/r2');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, ['test' => 'data']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo 'HTTP Code: ' . $httpCode . PHP_EOL;
echo 'Response: ' . substr($response, 0, 200) . PHP_EOL;
?>