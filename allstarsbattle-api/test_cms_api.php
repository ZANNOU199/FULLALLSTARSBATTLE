<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING CMS API ENDPOINT ===\n\n";

// Simulate the CMS data structure that the frontend sends
$testData = [
    'companies' => [
        [
            'id' => 1,
            'name' => 'Frontend Test Company',
            'choreographer' => 'Frontend Choreographer',
            'piece_title' => 'Frontend Piece',
            'description' => 'Frontend description',
            'bio' => 'Frontend bio',
            'main_image' => 'https://picsum.photos/seed/frontend/800/600',
            'gallery' => [],
            'performance_date' => '2026-03-26',
            'performance_time' => '21:00:00'
        ]
    ],
    'featuredPiece' => [
        'title' => 'Test Featured Piece',
        'choreographer' => 'Test Choreographer',
        'duration' => '30 MIN',
        'music' => 'Test Music',
        'image' => 'https://picsum.photos/seed/featured/800/600',
        'intention' => 'Test intention',
        'intentionAuthor' => 'Test Author',
        'performers' => 'Test Performers',
        'technology' => 'Test Technology'
    ]
];

echo "1. Testing CMS save with existing company...\n";
echo "Sending data: " . json_encode($testData, JSON_PRETTY_PRINT) . "\n\n";

// Simulate POST request to /api/cms/data
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/api/cms/data', 'POST', [], [], [], [], json_encode($testData));
$request->headers->set('Content-Type', 'application/json');
$request->headers->set('Accept', 'application/json');

$response = $kernel->handle($request);
$content = $response->getContent();

echo "Response status: " . $response->getStatusCode() . "\n";
echo "Response content: " . $content . "\n\n";

// Check what was saved
$companies = \App\Models\Company::all();
echo "Companies in database after save: {$companies->count()}\n";
foreach ($companies as $company) {
    echo "- ID: {$company->id}, Name: {$company->name}\n";
}

echo "\n2. Testing CMS save with new company (no ID)...\n";
$newCompanyData = [
    'companies' => [
        [
            'name' => 'New Company Without ID',
            'choreographer' => 'New Choreographer',
            'piece_title' => 'New Piece',
            'description' => 'New description',
            'bio' => 'New bio',
            'main_image' => 'https://picsum.photos/seed/new/800/600',
            'gallery' => [],
            'performance_date' => '2026-03-27',
            'performance_time' => '22:00:00'
        ]
    ],
    'featuredPiece' => $testData['featuredPiece']
];

$request2 = Illuminate\Http\Request::create('/api/cms/data', 'POST', [], [], [], [], json_encode($newCompanyData));
$request2->headers->set('Content-Type', 'application/json');
$request2->headers->set('Accept', 'application/json');

$response2 = $kernel->handle($request2);
$content2 = $response2->getContent();

echo "Response status: " . $response2->getStatusCode() . "\n";
echo "Response content: " . $content2 . "\n\n";

$companiesAfter = \App\Models\Company::all();
echo "Companies in database after adding new: {$companiesAfter->count()}\n";
foreach ($companiesAfter as $company) {
    echo "- ID: {$company->id}, Name: {$company->name}\n";
}

echo "\n3. Testing CMS save with update (modify existing)...\n";
$updateData = [
    'companies' => [
        [
            'id' => 1, // Existing ID
            'name' => 'Updated Frontend Company',
            'choreographer' => 'Updated Choreographer',
            'piece_title' => 'Updated Piece',
            'description' => 'Updated description',
            'bio' => 'Updated bio',
            'main_image' => 'https://picsum.photos/seed/updated/800/600',
            'gallery' => [],
            'performance_date' => '2026-03-26',
            'performance_time' => '21:00:00'
        ]
    ],
    'featuredPiece' => $testData['featuredPiece']
];

$request3 = Illuminate\Http\Request::create('/api/cms/data', 'POST', [], [], [], [], json_encode($updateData));
$request3->headers->set('Content-Type', 'application/json');
$request3->headers->set('Accept', 'application/json');

$response3 = $kernel->handle($request3);
$content3 = $response3->getContent();

echo "Response status: " . $response3->getStatusCode() . "\n";
echo "Response content: " . $content3 . "\n\n";

$companiesFinal = \App\Models\Company::all();
echo "Final companies in database: {$companiesFinal->count()}\n";
foreach ($companiesFinal as $company) {
    echo "- ID: {$company->id}, Name: {$company->name}\n";
}

echo "\n=== CMS API TEST COMPLETE ===\n";