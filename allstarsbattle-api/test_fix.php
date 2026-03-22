<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING FIX: State Refresh After Save ===\n\n";

// Test 1: Create first company
echo "1. Creating first company 'la'...\n";
$testData1 = [
    'companies' => [
        [
            'name' => 'la',
            'choreographer' => 'la',
            'piece_title' => 'la',
            'description' => 'tyyt',
            'bio' => 'uuuiu',
            'main_image' => 'https://i.ibb.co/LhsB2zPT/20260319-190925.jpg',
            'gallery' => [],
            'performance_date' => '2026-03-20',
            'performance_time' => '10:25:00'
        ]
    ],
    'featuredPiece' => ['title' => 'Test']
];

$request1 = Illuminate\Http\Request::create('/api/cms/data', 'POST', [], [], [], [], json_encode($testData1));
$request1->headers->set('Content-Type', 'application/json');
$request1->headers->set('Accept', 'application/json');

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response1 = $kernel->handle($request1);
echo "Response: " . $response1->getStatusCode() . "\n";

$companies1 = \App\Models\Company::all();
echo "Companies after first save: {$companies1->count()}\n";
foreach ($companies1 as $c) {
    echo "- ID: {$c->id}, Name: {$c->name}\n";
}

// Test 2: Create second company (this should NOT create duplicates)
echo "\n2. Creating second company 'ko'...\n";
$testData2 = [
    'companies' => [
        // This should include the existing company with real ID + new one
        [
            'id' => $companies1->first()->id, // Real ID from first company
            'name' => 'la',
            'choreographer' => 'la',
            'piece_title' => 'la',
            'description' => 'tyyt',
            'bio' => 'uuuiu',
            'main_image' => 'https://i.ibb.co/LhsB2zPT/20260319-190925.jpg',
            'gallery' => [],
            'performance_date' => '2026-03-20',
            'performance_time' => '10:25:00'
        ],
        [
            'name' => 'ko', // New company without ID
            'choreographer' => 'ko',
            'piece_title' => 'ko',
            'description' => 'ko',
            'bio' => 'ko',
            'main_image' => 'https://picsum.photos/seed/new/800/600',
            'gallery' => [],
            'performance_date' => '2026-03-05',
            'performance_time' => '10:23:00'
        ]
    ],
    'featuredPiece' => ['title' => 'Test']
];

$request2 = Illuminate\Http\Request::create('/api/cms/data', 'POST', [], [], [], [], json_encode($testData2));
$request2->headers->set('Content-Type', 'application/json');
$request2->headers->set('Accept', 'application/json');

$response2 = $kernel->handle($request2);
echo "Response: " . $response2->getStatusCode() . "\n";

$companies2 = \App\Models\Company::all();
echo "Companies after second save: {$companies2->count()}\n";
foreach ($companies2 as $c) {
    echo "- ID: {$c->id}, Name: {$c->name}\n";
}

echo "\n=== RESULT ===\n";
if ($companies2->count() === 2) {
    echo "✅ SUCCESS: No duplicates created!\n";
} else {
    echo "❌ FAILURE: Duplicates detected. Expected 2, got {$companies2->count()}\n";
}