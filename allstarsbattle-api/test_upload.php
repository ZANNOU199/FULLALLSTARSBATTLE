<?php
$ch = curl_init('http://localhost:8000/api/upload/r2');
$file = curl_file_create('C:/Users/LATITUDE 3520/TEST/ALLSTARSBATTLE/test.jpg', 'image/jpeg', 'test.jpg');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, ['file' => $file]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);
echo 'HTTP Code: ' . $httpCode . PHP_EOL;
echo 'Curl Error: ' . $curlError . PHP_EOL;
echo 'Response: ' . $response . PHP_EOL;
?>
