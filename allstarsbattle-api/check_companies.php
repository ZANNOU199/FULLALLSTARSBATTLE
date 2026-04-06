<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$companies = \App\Models\Company::all();
echo "Current companies in database:\n";
echo json_encode($companies->toArray(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
echo "\n\nTotal count: " . count($companies) . "\n";

// Also check the raw database
echo "\nRaw database check:\n";
$raw = \DB::table('companies')->select('id', 'name', 'choreographer')->get();
echo json_encode($raw->toArray(), JSON_PRETTY_PRINT);
