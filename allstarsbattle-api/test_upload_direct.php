<?php

require_once 'vendor/autoload.php';

use Illuminate\Http\Request;
use App\Http\Controllers\UploadController;

// Simuler une requête
echo "Testing UploadController directly...\n\n";

try {
    // Créer un contrôleur
    $controller = new UploadController();

    // Créer un faux fichier upload
    $uploadedFile = new \Illuminate\Http\UploadedFile(
        tempnam(sys_get_temp_dir(), 'test'),
        'test.jpg',
        'image/jpeg',
        null,
        true
    );

    file_put_contents($uploadedFile->getPathname(), 'fake image content');

    // Créer une requête
    $request = new Request();
    $request->files->set('file', $uploadedFile);

    // Appeler la méthode
    $response = $controller->upload($request);

    echo "Response: " . $response->getContent() . "\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}