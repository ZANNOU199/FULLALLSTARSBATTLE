<?php
// Test API endpoint directly

// Prepare test data
$testData = [
    'pageBackgrounds' => [
        'home' => [
            'imageUrl' => 'https://test.example.com/test-image-' . time() . '.jpg',
            'videoUrl' => '',
            'width' => 1920,
            'height' => 1080,
            'lastModified' => date('c')
        ]
    ],
    'companies' => [],
    'participants' => [],
    'program' => [],
    'blog' => ['articles' => []],
    'competition' => ['rules' => '', 'prizePool' => [], 'brackets' => []],
    'ticketing' => ['tickets' => []],
    'history' => ['timeline' => [], 'legends' => []],
    'partners' => [],
    'siteAssets' => ['backgrounds' => [], 'illustrations' => [], 'videos' => [], 'logo' => []],
    'contact' => ['hero' => [], 'sections' => []],
    'organize' => [],
    'participate' => [],
    'homepage' => [],
    'theme' => [],
    'categories' => [],
    'featuredPiece' => [],
    'judges' => [],
    'organizers' => []
];

echo "=== TEST API SAVE ===\n\n";
echo "Test data to send:\n";
echo json_encode($testData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n\n";

// Make the request
$ch = curl_init('http://localhost:8000/api/cms/data');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

echo "Sending POST request to http://localhost:8000/api/cms/data...\n";
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status Code: " . $httpCode . "\n\n";
echo "Response:\n";
echo $response ? $response : "No response";
echo "\n\n";

// Now check if data is in database
echo "=== CHECKING DATABASE ===\n\n";

// Load Laravel
require __DIR__ . '/bootstrap/app.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

// Use Eloquent to query
try {
    $result = \Illuminate\Support\Facades\DB::table('global_config')
        ->where('key', 'pageBackgrounds')
        ->first();
    
    if ($result) {
        echo "✓ PageBackgrounds found in database!\n";
        echo "Key: " . $result->key . "\n";
        echo "Updated at: " . $result->updated_at . "\n\n";
        
        $decoded = json_decode($result->value, true);
        echo "Decoded value:\n";
        echo json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    } else {
        echo "✗ PageBackgrounds NOT found in database\n";
        echo "\nAll config keys in database:\n";
        $allKeys = \Illuminate\Support\Facades\DB::table('global_config')->get();
        foreach ($allKeys as $row) {
            echo "  - " . $row->key . " (updated: " . $row->updated_at . ")\n";
        }
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
