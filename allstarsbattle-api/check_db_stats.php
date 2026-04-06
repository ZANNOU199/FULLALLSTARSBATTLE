<?php
require __DIR__ . '/vendor/autoload.php';

$conn = new mysqli('127.0.0.1', 'root', '', 'allstarsbattle');

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

echo "Checking 'stats' key in global_configs...\n";

$result = $conn->query("SELECT key, value FROM global_configs WHERE key LIKE 'stats%' OR key = 'stats'");

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "Key: " . $row['key'] . "\n";
        $decoded = json_decode($row['value'], true);
        if (is_array($decoded) && count($decoded) > 0) {
            echo "  Found " . count($decoded) . " items:\n";
            foreach($decoded as $item) {
                echo "    - " . (isset($item['label']) ? $item['label'] : 'NO LABEL') . ": " . (isset($item['value']) ? $item['value'] : 'NO VALUE') . "\n";
            }
        } else {
            echo "  Empty or invalid: " . $row['value'] . "\n";
        }
    }
} else {
    echo "No stats found in database\n";
    echo "\nAll keys in global_configs:\n";
    $allResults = $conn->query("SELECT DISTINCT key FROM global_configs ORDER BY key");
    while($row = $allResults->fetch_assoc()) {
        echo "  - " . $row['key'] . "\n";
    }
}

$conn->close();
?>
