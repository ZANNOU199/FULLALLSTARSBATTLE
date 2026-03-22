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

// CMS Data Endpoint - MAIN ENDPOINT (matches cmsService.getData() from frontend)
Route::get('/cms/data', [CMSController::class, 'getData']);
Route::post('/cms/data', [CMSController::class, 'saveData']);

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
