<?php
require 'vendor/autoload.php';
require 'bootstrap/app.php';

use Illuminate\Support\Facades\DB;

$participants = DB::table('participants')->get();
echo "Total participants: " . count($participants) . "\n";

foreach($participants as $p) {
    echo "ID: {$p->id}, Name: {$p->name}, Country: {$p->country}, Category: {$p->category}\n";
}
?>
