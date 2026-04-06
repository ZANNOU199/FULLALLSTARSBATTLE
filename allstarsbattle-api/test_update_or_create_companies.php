<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

foreach (['1680000000000','1680000000001'] as $id) {
    $c = App\Models\Company::updateOrCreate(['id' => $id], [
        'name' => 'temp',
        'choreographer' => 'x',
        'piece_title' => 'p',
        'description' => 'd',
        'bio' => 'b',
        'main_image' => 'm',
        'gallery' => json_encode([]),
        'performance_date' => null,
        'performance_time' => null,
    ]);
    echo "added: {$c->id}\n";
}
$all = App\Models\Company::all()->pluck('id')->toArray();
echo 'all ids: '. implode(',', $all) ."\n";
