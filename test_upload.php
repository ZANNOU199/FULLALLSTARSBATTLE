<?php
// Créer un fichier test temporaire
$testFile = tempnam(sys_get_temp_dir(), 'test_upload') . '.png';
file_put_contents($testFile, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='));

// Test upload via API
$ch = curl_init('http://localhost:8000/api/upload/r2');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$postData = [
    'file' => new CURLFile($testFile, 'image/png', 'test.png')
];

curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Nettoyer
unlink($testFile);

echo 'HTTP Code: ' . $httpCode . PHP_EOL;
echo 'CURL Error: ' . $curlError . PHP_EOL;
echo 'Response: ' . $response . PHP_EOL;
?>