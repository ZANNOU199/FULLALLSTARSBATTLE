<?php

// Parse DATABASE_URL and set DB_* environment variables for Laravel
if (isset($_ENV['DATABASE_URL'])) {
    $url = parse_url($_ENV['DATABASE_URL']);

    if ($url) {
        putenv("DB_CONNECTION=pgsql");
        putenv("DB_HOST=" . ($url['host'] ?? 'localhost'));
        putenv("DB_PORT=" . ($url['port'] ?? '5432'));
        putenv("DB_DATABASE=" . ltrim($url['path'] ?? '', '/'));
        putenv("DB_USERNAME=" . ($url['user'] ?? ''));
        putenv("DB_PASSWORD=" . ($url['pass'] ?? ''));
    }
}