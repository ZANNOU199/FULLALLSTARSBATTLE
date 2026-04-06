<?php
$host = '127.0.0.1';
$db = 'allstarsbattle';
$user = 'root';
$pass = '12345';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $stmt = $pdo->query('SELECT * FROM participants');
    $participants = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Total participants in database: " . count($participants) . "\n";
    echo "---\n";
    
    if(empty($participants)) {
        echo "No participants found!\n";
    } else {
        foreach($participants as $p) {
            echo "ID: {$p['id']}, Name: {$p['name']}, Country: {$p['country']}, Category: {$p['category']}\n";
        }
    }
} catch(PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
?>
