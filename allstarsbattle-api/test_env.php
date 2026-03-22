<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "R2_ACCESS_KEY_ID: " . (env('R2_ACCESS_KEY_ID') ? 'SET' : 'NOT SET') . PHP_EOL;
echo "R2_SECRET_ACCESS_KEY: " . (env('R2_SECRET_ACCESS_KEY') ? 'SET' : 'NOT SET') . PHP_EOL;
echo "R2_ACCOUNT_ID: " . (env('R2_ACCOUNT_ID') ? 'SET' : 'NOT SET') . PHP_EOL;
echo "R2_BUCKET_NAME: " . (env('R2_BUCKET_NAME') ? 'SET' : 'NOT SET') . PHP_EOL;
echo "R2_PUBLIC_URL: " . (env('R2_PUBLIC_URL') ? 'SET' : 'NOT SET') . PHP_EOL;

echo PHP_EOL . "Actual values:" . PHP_EOL;
echo "R2_ACCESS_KEY_ID: '" . env('R2_ACCESS_KEY_ID') . "'" . PHP_EOL;
echo "R2_SECRET_ACCESS_KEY: '" . substr(env('R2_SECRET_ACCESS_KEY'), 0, 10) . "...'" . PHP_EOL;
echo "R2_ACCOUNT_ID: '" . env('R2_ACCOUNT_ID') . "'" . PHP_EOL;
echo "R2_BUCKET_NAME: '" . env('R2_BUCKET_NAME') . "'" . PHP_EOL;
echo "R2_PUBLIC_URL: '" . env('R2_PUBLIC_URL') . "'" . PHP_EOL;