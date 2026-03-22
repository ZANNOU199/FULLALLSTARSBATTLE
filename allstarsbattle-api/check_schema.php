<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "=== COMPANIES TABLE SCHEMA ===\n";
$schema = \DB::getSchemaBuilder();
$columns = $schema->getColumns('companies');

foreach ($columns as $col) {
    echo "Column: " . $col->getName() . "\n";
    echo "  Type: " . $col->getType() . "\n";
    echo "  Auto Increment: " . ($col->getAutoIncrement() ? "YES" : "NO") . "\n";
    echo "  Nullable: " . ($col->getNotnull() ? "NO" : "YES") . "\n";
    echo "\n";
}

echo "\n=== CHECKING COMPANY MODEL INCREMENTS ===\n";
$company = new \App\Models\Company();
echo "Model \$incrementing: " . ($company->incrementing ? "true" : "false") . "\n";
echo "Model \$keyType: " . $company->keyType . "\n";
echo "Model \$primaryKey: " . $company->primaryKey . "\n";
