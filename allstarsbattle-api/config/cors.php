<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin requests can execute
    | in web browsers. The values that you list here will be put into
    | response headers. You are free to adjust these values as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Production domains
        'https://www.allstarbattle.dance',
        'https://allstarbattle.dance',
        'https://allstarbattle.vercel.app',

        // Development domains
        'http://localhost:5173',
        'http://127.0.0.1:5173',

        // Environment variable fallback
        env('FRONTEND_URL'),
    ],

    'allowed_origins_patterns' => [
        // Allow all allstarbattle.dance subdomains
        '/\.allstarbattle\.dance$/',
        // Allow localhost with any port
        '/localhost:\d+/',
        '/127\.0\.0\.1:\d+/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
