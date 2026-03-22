<?php

// Test script pour l'upload vers R2
echo "Testing R2 Upload API...\n\n";

// Créer un fichier temporaire pour le test
$tempFile = tempnam(sys_get_temp_dir(), 'test_image');
file_put_contents($tempFile, 'fake image content for testing');

// Créer une requête multipart/form-data
$boundary = '----FormBoundary' . md5(time());
$data = "--$boundary\r\n";
$data .= 'Content-Disposition: form-data; name="file"; filename="test.jpg"' . "\r\n";
$data .= 'Content-Type: image/jpeg' . "\r\n\r\n";
$data .= file_get_contents($tempFile) . "\r\n";
$data .= "--$boundary--\r\n";

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: multipart/form-data; boundary=$boundary\r\n" .
                   "Content-Length: " . strlen($data),
        'content' => $data
    ]
]);

$url = 'http://localhost:8000/api/upload/r2';
echo "Making request to: $url\n";

$response = file_get_contents($url, false, $context);

if ($response === false) {
    echo "❌ Error: Could not connect to API\n";
    echo "Make sure Laravel server is running on port 8000\n";
} else {
    echo "✅ API Response:\n";
    echo $response . "\n\n";

    $json = json_decode($response, true);
    if ($json && isset($json['success'])) {
        if ($json['success']) {
            echo "✅ Upload successful!\n";
            echo "File URL: " . $json['url'] . "\n";
        } else {
            echo "❌ Upload failed: " . ($json['message'] ?? 'Unknown error') . "\n";
        }
    } else {
        echo "❌ Invalid JSON response\n";
    }
}

// Nettoyer
unlink($tempFile);

echo "\nTest completed.\n";