<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$payload = [
    'companies' => [],
    'organizers' => [
        [
            'name' => 'Test Org',
            'role' => 'Test Role',
            'bio' => 'Test bio',
            'photo' => 'https://picsum.photos/seed/testorg/400/500',
            'socialLinks' => ['instagram' => 'testorg']
        ]
    ],
    'organizersConfig' => [
        'sectionTitle' => 'Test Title',
        'sectionDescription' => 'Test Desc',
        'organizationName' => 'Test Org Name'
    ]
];

$req = Illuminate\Http\Request::create('/api/cms/data', 'POST', [], [], [], [], json_encode($payload));
$req->headers->set('Content-Type', 'application/json');
$resp = $kernel->handle($req);
echo "POST status: " . $resp->getStatusCode() . "\n";
echo "POST response: " . substr($resp->getContent(), 0, 500) . "\n";

$getReq = Illuminate\Http\Request::create('/api/cms/data', 'GET');
$getResp = $kernel->handle($getReq);
$data = json_decode($getResp->getContent(), true);

echo "--- GET organizers: " . json_encode($data['organizers']) . "\n";
echo "--- GET organizersConfig: " . json_encode($data['organizersConfig']) . "\n";
