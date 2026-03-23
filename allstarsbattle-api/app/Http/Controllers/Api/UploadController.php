<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Aws\S3\S3Client;

class UploadController extends Controller
{
    /**
     * Upload un fichier vers Cloudflare R2 (méthode simple)
     */
    public function upload(Request $request)
    {
        try {
            \Log::info('Upload request received', [
                'has_file' => $request->hasFile('file'),
                'all_files' => $request->allFiles(),
                'content_type' => $request->header('Content-Type')
            ]);

            // Validation du fichier - Accepte images et vidéos
            // Images: max 10MB, Vidéos: max 100MB
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:102400|mimes:jpeg,jpg,png,gif,webp,mp4,webm,ogg,mov,quicktime', // 100MB pour les vidéos
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Fichier invalide: ' . implode(', ', $validator->errors()->all())
                ], 400);
            }

            $file = $request->file('file');
            \Log::info('File received', [
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize()
            ]);

            // Générer un nom de fichier unique
            $extension = $file->getClientOriginalExtension();
            $fileName = time() . '-' . Str::random(6) . '.' . $extension;

            // Chemin dans le bucket R2
            $path = 'media/' . $fileName;

            \Log::info('Attempting upload to R2', ['path' => $path]);

            // Debug credentials
            \Log::info('R2 Credentials Debug', [
                'R2_ACCESS_KEY_ID' => env('R2_ACCESS_KEY_ID') ? 'SET' : 'NOT SET',
                'R2_SECRET_ACCESS_KEY' => env('R2_SECRET_ACCESS_KEY') ? 'SET' : 'NOT SET',
                'R2_ACCOUNT_ID' => env('R2_ACCOUNT_ID') ? 'SET' : 'NOT SET',
                'R2_BUCKET_NAME' => env('R2_BUCKET_NAME') ? 'SET' : 'NOT SET',
                'R2_PUBLIC_URL' => env('R2_PUBLIC_URL') ? 'SET' : 'NOT SET',
            ]);

            // Créer le client S3 pour R2
            $s3Client = new S3Client([
                'version' => 'latest',
                'region'  => 'auto',
                'endpoint' => 'https://' . env('R2_ACCOUNT_ID') . '.r2.cloudflarestorage.com',
                'credentials' => [
                    'key'    => env('R2_ACCESS_KEY_ID'),
                    'secret' => env('R2_SECRET_ACCESS_KEY'),
                ],
                'http' => [
                    'verify' => false, // Temporairement désactiver la vérification SSL
                ],
            ]);

            // Upload du fichier
            $result = $s3Client->putObject([
                'Bucket' => env('R2_BUCKET_NAME'),
                'Key'    => $path,
                'Body'   => fopen($file->getPathname(), 'r'),
                'ContentType' => $file->getClientMimeType(),
            ]);

            // Construire l'URL publique
            $fileUrl = env('R2_PUBLIC_URL') . '/' . $path;

            \Log::info('Upload successful', ['url' => $fileUrl]);

            return response()->json([
                'success' => true,
                'url' => $fileUrl,
                'fileName' => $fileName,
            ]);

        } catch (\Exception $e) {
            \Log::error('R2 Upload Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload du fichier: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload un fichier vers Cloudflare R2 (méthode AWS SDK)
     */
    public function uploadToR2(Request $request)
    {
        try {
            // Valider le fichier
            $request->validate([
                'file' => 'required|file|image|max:10240', // 10MB max
            ]);

            $file = $request->file('file');

            // Vérifier la configuration R2
            $accountId = config('cloudflare.r2_account_id');
            $accessKeyId = config('cloudflare.r2_access_key_id');
            $secretAccessKey = config('cloudflare.r2_secret_access_key');
            $bucketName = config('cloudflare.r2_bucket_name');
            $publicUrl = config('cloudflare.r2_public_url');

            if (!$accountId || !$accessKeyId || !$secretAccessKey || !$bucketName || !$publicUrl) {
                return response()->json([
                    'error' => 'Configuration Cloudflare R2 manquante'
                ], 500);
            }

            // Créer le client S3 pour R2
            $s3Client = new S3Client([
                'version' => 'latest',
                'region'  => 'auto',
                'endpoint' => "https://{$accountId}.r2.cloudflarestorage.com",
                'credentials' => [
                    'key'    => $accessKeyId,
                    'secret' => $secretAccessKey,
                ],
            ]);

            // Générer un nom de fichier unique
            $fileName = Str::random(5) . '-' . time() . '.' . $file->getClientOriginalExtension();
            $key = "media/{$fileName}";

            // Upload du fichier
            $result = $s3Client->putObject([
                'Bucket' => $bucketName,
                'Key'    => $key,
                'Body'   => fopen($file->getPathname(), 'r'),
                'ContentType' => $file->getClientMimeType(),
            ]);

            // Construire l'URL publique
            $fileUrl = "{$publicUrl}/{$key}";

            return response()->json([
                'success' => true,
                'url' => $fileUrl,
                'fileName' => $fileName,
            ]);

        } catch (\Exception $e) {
            \Log::error('R2 Upload Error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Erreur lors de l\'upload du fichier: ' . $e->getMessage()
            ], 500);
        }
    }
}
