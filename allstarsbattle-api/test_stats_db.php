<?php
require __DIR__ . '/bootstrap/app.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

use Illuminate\Support\Facades\DB;
use App\Models\GlobalConfig;

// Check what's in the database
echo "=== Checking GlobalConfig table ===\n";
echo "Total records: " . GlobalConfig::count() . "\n\n";

echo "Stats records:\n";
$statsRecords = GlobalConfig::where('key', 'stats')->get();

foreach ($statsRecords as $record) {
    echo "Key: " . $record->key . "\n";
    echo "Value: " . $record->value . "\n";
    $decoded = json_decode($record->value, true);
    echo "Decoded: " . json_encode($decoded) . "\n";
    echo "Count: " . count($decoded) . "\n\n";
}

if (count($statsRecords) === 0) {
    echo "No 'stats' key found!\n\n";
    echo "Sample keys in database:\n";
    GlobalConfig::limit(10)->get()->each(function($record) {
        echo "  - " . $record->key . "\n";
    });
}
?>
