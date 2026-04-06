<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Clear all companies
$count = \App\Models\Company::count();
\App\Models\Company::truncate();
$newCount = \App\Models\Company::count();

echo "Cleared $count companies from database.\n";
echo "Remaining companies: $newCount\n";