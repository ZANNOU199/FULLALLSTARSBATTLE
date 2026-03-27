<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CMSController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ParticipantController;
use App\Http\Controllers\Api\OrganizerController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\UploadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint for Railway/Vercel
Route::get('/', fn() => response()->json(['status' => 'ok']));
Route::get('/health', fn() => response()->json(['status' => 'ok', 'timestamp' => now()]));

// CMS Data Endpoint - MAIN ENDPOINT (matches cmsService.getData() from frontend)
Route::get('/cms/data', [CMSController::class, 'getData']);
Route::post('/cms/data', [CMSController::class, 'saveData']);

// Debug endpoint to test if API is working
Route::get('/test', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is working!'
    ]);
});

// Debug endpoint to test POST
Route::post('/test-save', function (Request $request) {
    \Log::info('=== TEST SAVE REQUEST ===');
    \Log::info('Received data:', $request->all());
    
    // Try to save test data to database
    try {
        \DB::table('global_config')->updateOrCreate(
            ['key' => 'test_data'],
            ['value' => json_encode($request->all())]
        );
        
        // Verify it was saved
        $saved = \DB::table('global_config')->where('key', 'test_data')->first();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Test data saved successfully',
            'saved_data' => $saved
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

use Illuminate\Mail\Mailable;

// TEST SMTP CONFIGURATION
Route::get('/test-smtp', function () {
    $config = [
        'driver' => config('mail.default'),
        'mailer' => config('mail.default'),
        'scheme' => config('mail.mailers.smtp.scheme'),
        'host' => config('mail.mailers.smtp.host'),
        'port' => config('mail.mailers.smtp.port'),
        'timeout' => config('mail.mailers.smtp.timeout'),
        'username' => env('MAIL_USERNAME') ? substr(env('MAIL_USERNAME'), 0, 5) . '***' : 'NOT SET',
        'password_set' => !empty(env('MAIL_PASSWORD')),
        'encryption' => env('MAIL_ENCRYPTION', 'NOT SET'),
        'from_address' => env('MAIL_FROM_ADDRESS', 'NOT SET'),
    ];

    try {
        $testEmail = env('MAIL_USERNAME');
        if (!$testEmail) {
            return response()->json([
                'status' => 'error',
                'message' => 'MAIL_USERNAME is not configured in Render environment',
                'config' => $config
            ], 500);
        }

        // Create inline test mailable
        $testMailable = new class extends Mailable {
            public function build()
            {
                return $this
                    ->subject('SMTP Test from All Stars Battle API')
                    ->text('This is a test message to verify SMTP configuration is working. Sent at: ' . now());
            }
        };

        // Send the test email
        \Mail::to($testEmail)->send($testMailable);

        \Log::info('SMTP Test successful', $config);

        return response()->json([
            'status' => 'success',
            'message' => 'SMTP test email sent successfully!',
            'config' => $config
        ]);
    } catch (\Exception $e) {
        \Log::error('SMTP Test Error', [
            'error' => $e->getMessage(),
            'code' => $e->getCode(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => substr($e->getTraceAsString(), 0, 1000),
            'config' => $config
        ]);

        return response()->json([
            'status' => 'error',
            'message' => 'SMTP connection/sending failed',
            'error' => $e->getMessage(),
            'config' => $config
        ], 500);
    }
});

// Participants management endpoints (for admin panel)
Route::post('/cms/participants', [CMSController::class, 'storeParticipant']);
Route::put('/cms/participants/{id}', [CMSController::class, 'updateParticipant']);
Route::delete('/cms/participants/{id}', [CMSController::class, 'destroyParticipant']);

// Blog/Articles management endpoints
Route::post('/cms/blog-articles', [CMSController::class, 'storeArticle']);
Route::put('/cms/blog-articles/{id}', [CMSController::class, 'updateArticle']);
Route::delete('/cms/blog-articles/{id}', [CMSController::class, 'destroyArticle']);

// FAQ management endpoints
Route::post('/cms/faqs', [CMSController::class, 'storeFAQ']);
Route::put('/cms/faqs/{id}', [CMSController::class, 'updateFAQ']);
Route::delete('/cms/faqs/{id}', [CMSController::class, 'destroyFAQ']);

// Program management endpoints
Route::post('/cms/program-days', [CMSController::class, 'storeProgramDay']);
Route::put('/cms/program-days/{id}', [CMSController::class, 'updateProgramDay']);
Route::delete('/cms/program-days/{id}', [CMSController::class, 'destroyProgramDay']);

Route::post('/cms/activities', [CMSController::class, 'storeActivity']);
Route::put('/cms/activities/{id}', [CMSController::class, 'updateActivity']);
Route::delete('/cms/activities/{id}', [CMSController::class, 'destroyActivity']);

Route::post('/cms/categories', [CMSController::class, 'storeCategory']);
Route::delete('/cms/categories/{name}', [CMSController::class, 'destroyCategory']);

// Contact Messages management endpoints
Route::get('/cms/contact-messages', [CMSController::class, 'getContactMessages']);
Route::post('/cms/contact-messages', [CMSController::class, 'storeContactMessage']);
Route::put('/cms/contact-messages/{id}/read', [CMSController::class, 'markContactMessageAsRead']);
Route::put('/cms/contact-messages/{id}/replied', [CMSController::class, 'markContactMessageAsReplied']);
Route::post('/cms/contact-messages/{id}/reply', [CMSController::class, 'replyContactMessage']);
Route::post('/cms/contact-messages/send', [CMSController::class, 'sendAdminMessage']);
Route::delete('/cms/contact-messages/{id}', [CMSController::class, 'destroyContactMessage']);

// Upload endpoint
Route::post('/upload/r2', [UploadController::class, 'upload']);

// Authenticated routes (protected with sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Companies
    Route::apiResource('companies', CompanyController::class);
    
    // Participants (Dancers, Judges, DJs, MCs)
    Route::apiResource('participants', ParticipantController::class);
    
    // Organizers
    Route::apiResource('organizers', OrganizerController::class);
    
    // Articles/Blog
    Route::apiResource('articles', ArticleController::class);
    
    // User endpoint
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

/*
|--------------------------------------------------------------------------
| CORS & API Configuration
|--------------------------------------------------------------------------
|
| API will be accessible from React frontend at localhost:5173
| All responses return proper JSON structure matching CMSData interface
|
*/
