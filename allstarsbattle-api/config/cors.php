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
        'http://localhost:5173',      // React dev server (Vite)
        'http://localhost:3000',      // Alternative frontend
        'http://127.0.0.1:5173',      // Localhost variation
        'http://127.0.0.1:3000',      // Localhost variation
        'https://all-stars-battle-six.vercel.app',  // Vercel production
        'https://allstarbattle.vercel.app',         // Nouveau domaine Vercel
        'https://allstarbattle.dance',
        'https://www.allstarbattle.dance',
        'https://api.allstarbattle.dance',          // API subdomain
        'https://*.allstarbattle.dance',            // Wildcard for all subdomains
        env('FRONTEND_URL', 'http://localhost:5173'),  // Use .env value
    ],

    'allowed_origins_patterns' => [
        '/localhost:\d+/',
        '/127.0.0.1:\d+/',
        '/\.allstarbattle\.dance$/',                // Allow all allstarbattle.dance subdomains
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
