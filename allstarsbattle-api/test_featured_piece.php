<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING FEATURED PIECE SAVE ===\n\n";

// Test data for featured piece
$testData = [
    'companies' => [], // Empty companies for this test
    'featuredPiece' => [
        'title' => 'Test Featured Piece',
        'image' => 'https://picsum.photos/seed/test-featured/800/600',
        'duration' => '45 MIN',
        'choreographer' => 'Test Choreographer',
        'music' => 'Test Music',
        'description' => 'Test description',
        'fullSynopsis' => 'Test full synopsis',
        'intentionQuote' => 'Test intention quote',
        'intentionAuthor' => 'Test Author',
        'performers' => 'Test Performers',
        'technology' => 'Test Technology'
    ]
];

echo "1. Saving featured piece...\n";

// Simulate POST request to /api/cms/data
$request = Illuminate\Http\Request::create('/api/cms/data', 'POST', [], [], [], [], json_encode($testData));
$request->headers->set('Content-Type', 'application/json');
$request->headers->set('Accept', 'application/json');

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request);
$content = $response->getContent();

echo "Response status: " . $response->getStatusCode() . "\n";
echo "Response: " . substr($content, 0, 200) . "...\n\n";

// Check what was saved
$featuredPiece = \App\Models\FeaturedPiece::first();
if ($featuredPiece) {
    echo "2. Featured piece saved successfully:\n";
    echo "- ID: {$featuredPiece->id}\n";
    echo "- Title: {$featuredPiece->title}\n";
    echo "- Choreographer: {$featuredPiece->choreographer}\n";
    echo "- Duration: {$featuredPiece->duration}\n";
    echo "- Description: " . substr($featuredPiece->description, 0, 50) . "...\n";
} else {
    echo "2. ERROR: Featured piece not saved!\n";
}

echo "\n3. Testing GET request to verify data is returned...\n";

// Simulate GET request to /api/cms/data
$getRequest = Illuminate\Http\Request::create('/api/cms/data', 'GET');
$getResponse = $kernel->handle($getRequest);
$getContent = $getResponse->getContent();
$data = json_decode($getContent, true);

if (isset($data['featuredPiece']) && $data['featuredPiece']) {
    echo "✅ GET request successful - featured piece returned:\n";
    echo "- Title: {$data['featuredPiece']['title']}\n";
    echo "- Choreographer: {$data['featuredPiece']['choreographer']}\n";
} else {
    echo "❌ GET request failed - no featured piece returned\n";
}

echo "\n=== TEST COMPLETE ===\n";