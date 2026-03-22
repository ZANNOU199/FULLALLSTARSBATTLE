<?php

// Test script for contact messages API
require_once 'vendor/autoload.php';

use Illuminate\Http\Request;
use App\Http\Controllers\Api\CMSController;

echo "=== Testing Contact Messages API ===\n\n";

// Test 1: Create a contact message
echo "1. Testing POST /api/cms/contact-messages\n";

$testData = [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'subject' => 'Test Subject',
    'message' => 'This is a test message from the contact form.'
];

$controller = new CMSController();
$request = new Request();
$request->merge($testData);

try {
    $response = $controller->storeContactMessage($request);
    $statusCode = $response->getStatusCode();
    echo "Status: $statusCode\n";

    if ($statusCode === 201) {
        $data = json_decode($response->getContent(), true);
        echo "Message created successfully!\n";
        echo "ID: " . ($data['id'] ?? 'N/A') . "\n";
        $messageId = $data['id'] ?? null;
    } else {
        echo "Failed to create message\n";
        echo "Response: " . $response->getContent() . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n2. Testing GET /api/cms/contact-messages\n";

try {
    $messages = $controller->getContactMessages();
    echo "Found " . count($messages) . " messages\n";

    if (count($messages) > 0) {
        $latestMessage = $messages[0];
        echo "Latest message:\n";
        echo "- Name: " . $latestMessage['name'] . "\n";
        echo "- Email: " . $latestMessage['email'] . "\n";
        echo "- Subject: " . ($latestMessage['subject'] ?? 'N/A') . "\n";
        echo "- Status: " . $latestMessage['status'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n=== Test Complete ===\n";