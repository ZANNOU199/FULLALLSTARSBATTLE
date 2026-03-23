#!/usr/bin/env php
<?php

// Read directly from database
require __DIR__ . '/bootstrap/app.php';

use Illuminate\Support\Facades\DB;

echo "\n=== CHECKING DATABASE ===\n\n";

// Check if pageBackgrounds exists
$result = DB::table('global_config')
    ->where('key', 'pageBackgrounds')
    ->first();

if ($result) {
    echo "✓ pageBackgrounds FOUND in database!\n";
    echo "Updated at: " . $result->updated_at . "\n";
    echo "Value length: " . strlen($result->value) . " characters\n\n";
    
    $decoded = json_decode($result->value, true);
    echo "Decoded value:\n";
    echo json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
} else {
    echo "✗ pageBackgrounds NOT found in database\n";
}

echo "\n=== ALL CONFIG KEYS ===\n";
$allKeys = DB::table('global_config')->get();
foreach ($allKeys as $row) {
    echo "- " . $row->key . " (updated: " . $row->updated_at . ")\n";
}

echo "\n=== CHECKING LATEST LOGS ===\n";
$logFile = __DIR__ . '/storage/logs/laravel.log';
if (file_exists($logFile)) {
    $lines = file($logFile);
    $lastLines = array_slice($lines, -50);
    echo implode('', $lastLines);
}
