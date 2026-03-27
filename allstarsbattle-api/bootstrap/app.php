<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Parse DATABASE_URL for Render
if (isset($_ENV['DATABASE_URL'])) {
    $url = parse_url($_ENV['DATABASE_URL']);
    if ($url) {
        $_ENV['DB_CONNECTION'] = 'pgsql';
        $_ENV['DB_HOST'] = $url['host'] ?? 'localhost';
        $_ENV['DB_PORT'] = $url['port'] ?? '5432';
        $_ENV['DB_DATABASE'] = ltrim($url['path'] ?? '', '/');
        $_ENV['DB_USERNAME'] = $url['user'] ?? '';
        $_ENV['DB_PASSWORD'] = $url['pass'] ?? '';
    }
}

// Force PostgreSQL connection if DB_* variables are set (Render setup)
if (isset($_ENV['DB_HOST']) && isset($_ENV['DB_DATABASE'])) {
    $_ENV['DB_CONNECTION'] = 'pgsql';
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \App\Http\Middleware\ForceJsonResponse::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e) {
            // Always return JSON for API requests and errors
            if (request()->wantsJson() || request()->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
            }
        });
    })->create();
