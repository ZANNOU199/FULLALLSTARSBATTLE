<?php
// Load Laravel
require __DIR__ . '/bootstrap/app.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

// Check database
$result = \Illuminate\Support\Facades\DB::table('global_config')->where('key', 'pageBackgrounds')->first();

if ($result) {
    echo "=== PAGE BACKGROUNDS IN DATABASE ===\n";
    echo "Key: " . $result->key . "\n";
    echo "Value: " . $result->value . "\n";
    echo "\nDecoded:\n";
    echo json_encode(json_decode($result->value, true), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} else {
    echo "pageBackgrounds not found in database!\n";
}

// Also check all config keys
echo "\n\n=== ALL CONFIG KEYS ===\n";
$allKeys = \Illuminate\Support\Facades\DB::table('global_config')->get();
foreach ($allKeys as $row) {
    echo "- " . $row->key . "\n";
}
