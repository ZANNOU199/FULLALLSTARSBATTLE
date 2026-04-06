<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING CRUD OPERATIONS ===\n\n";

// Test 1: Create a company
echo "1. Creating a test company...\n";
$companyData = [
    'name' => 'Test Company',
    'choreographer' => 'Test Choreographer',
    'piece_title' => 'Test Piece',
    'description' => 'Test description',
    'bio' => 'Test bio',
    'main_image' => 'https://picsum.photos/seed/test/800/600',
    'gallery' => json_encode([]),
    'performance_date' => '2026-03-25',
    'performance_time' => '20:00:00'
];

$company = \App\Models\Company::create($companyData);
echo "✓ Created company ID: {$company->id}\n";
echo "  Name: {$company->name}\n\n";

// Test 2: Read companies
echo "2. Reading all companies...\n";
$companies = \App\Models\Company::all();
echo "✓ Found {$companies->count()} companies\n\n";

// Test 3: Update the company
echo "3. Updating the company...\n";
$company->update([
    'name' => 'Updated Test Company',
    'choreographer' => 'Updated Choreographer'
]);
echo "✓ Updated company ID: {$company->id}\n";
echo "  New name: {$company->name}\n\n";

// Test 4: Verify no duplicates were created
echo "4. Checking for duplicates...\n";
$duplicateCount = \App\Models\Company::where('name', 'Test Company')->count();
$updatedCount = \App\Models\Company::where('name', 'Updated Test Company')->count();
echo "✓ Original name count: $duplicateCount (should be 0)\n";
echo "✓ Updated name count: $updatedCount (should be 1)\n\n";

// Test 5: Delete the company
echo "5. Deleting the company...\n";
$company->delete();
$remainingCount = \App\Models\Company::count();
echo "✓ Deleted company. Remaining: $remainingCount (should be 0)\n\n";

echo "=== CRUD TEST COMPLETE ===\n";
echo "If all checks show expected values, the database operations are working correctly.\n";