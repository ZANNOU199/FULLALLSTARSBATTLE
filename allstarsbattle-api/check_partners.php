<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Partner;

echo "Partners count: " . Partner::count() . PHP_EOL;

$partners = Partner::all();
foreach ($partners as $partner) {
    echo $partner->id . ': ' . $partner->name . ' (' . $partner->category . ')' . PHP_EOL;
}