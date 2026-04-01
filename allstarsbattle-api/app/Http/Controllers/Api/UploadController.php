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
     * Add CORS headers to response
     */
    private function addCorsHeaders($response)
    {
        return $response->header('Access-Control-Allow-Origin', 'https://www.allstarbattle.dance')
                       ->header('Access-Control-Allow-Credentials', 'true')
                       ->header('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-TOKEN, Authorization')
                       ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
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
                return $this->addCorsHeaders(response()->json([
                    'success' => false,
                    'message' => 'Fichier invalide: ' . implode(', ', $validator->errors()->all())
                ], 400));
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

            // Vérifier la configuration R2
            $accountId = config('cloudflare.r2_account_id');
            $accessKeyId = config('cloudflare.r2_access_key_id');
            $secretAccessKey = config('cloudflare.r2_secret_access_key');
            $bucketName = config('cloudflare.r2_bucket_name');
            $publicUrl = config('cloudflare.r2_public_url');

            \Log::info('R2 Credentials Debug', [
                'R2_ACCOUNT_ID' => $accountId ? 'SET' : 'NOT SET',
                'R2_ACCESS_KEY_ID' => $accessKeyId ? 'SET' : 'NOT SET',
                'R2_SECRET_ACCESS_KEY' => $secretAccessKey ? 'SET' : 'NOT SET',
                'R2_BUCKET_NAME' => $bucketName ? 'SET' : 'NOT SET',
                'R2_PUBLIC_URL' => $publicUrl ? 'SET' : 'NOT SET',
            ]);

            if (!$accountId || !$accessKeyId || !$secretAccessKey || !$bucketName || !$publicUrl) {
                \Log::error('R2 Configuration missing', ['config' => [
                    'account_id' => $accountId,
                    'bucket_name' => $bucketName,
                    'public_url' => $publicUrl
                ]]);
                return $this->addCorsHeaders(response()->json([
                    'success' => false,
                    'message' => 'Configuration Cloudflare R2 manquante'
                ], 500));
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

            // Upload du fichier
            $result = $s3Client->putObject([
                'Bucket' => $bucketName,
                'Key'    => $path,
                'Body'   => fopen($file->getPathname(), 'r'),
                'ContentType' => $file->getClientMimeType(),
            ]);

            // Construire l'URL publique
            $fileUrl = $publicUrl . '/' . $path;

            \Log::info('Upload successful', ['url' => $fileUrl]);

            return $this->addCorsHeaders(response()->json([
                'success' => true,
                'url' => $fileUrl,
                'fileName' => $fileName,
            ]));

        } catch (\Exception $e) {
            \Log::error('R2 Upload Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->addCorsHeaders(response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload du fichier: ' . $e->getMessage()
            ], 500));
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
                return $this->addCorsHeaders(response()->json([
                    'error' => 'Configuration Cloudflare R2 manquante'
                ], 500));
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

            return $this->addCorsHeaders(response()->json([
                'success' => true,
                'url' => $fileUrl,
                'fileName' => $fileName,
            ]));

        } catch (\Exception $e) {
            \Log::error('R2 Upload Error: ' . $e->getMessage());
            
            return $this->addCorsHeaders(response()->json([
                'error' => 'Erreur lors de l\'upload du fichier: ' . $e->getMessage()
            ], 500));
        }
    }

    /**
     * Supprime un fichier de Cloudflare R2 en se basant sur son URL complète
     * Méthode statique pour être utilisée de n'importe où
     */
    public static function deleteFromR2(?string $fileUrl): bool
    {
        if (!$fileUrl) {
            \Log::warning('deleteFromR2: No URL provided');
            return false;
        }

        try {
            // Extraire la clé (path) du fichier à partir de l'URL
            $publicUrl = config('cloudflare.r2_public_url');
            
            // Si l'URL commence par le public URL, extraire la clé
            if (strpos($fileUrl, $publicUrl) !== false) {
                $key = str_replace($publicUrl . '/', '', $fileUrl);
            } else {
                \Log::warning('deleteFromR2: URL does not match public URL', ['url' => $fileUrl, 'publicUrl' => $publicUrl]);
                return false;
            }

            // Vérifier la configuration R2
            $accountId = config('cloudflare.r2_account_id');
            $accessKeyId = config('cloudflare.r2_access_key_id');
            $secretAccessKey = config('cloudflare.r2_secret_access_key');
            $bucketName = config('cloudflare.r2_bucket_name');

            if (!$accountId || !$accessKeyId || !$secretAccessKey || !$bucketName) {
                \Log::error('deleteFromR2: Cloudflare R2 configuration missing');
                return false;
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

            // Supprimer le fichier
            $result = $s3Client->deleteObject([
                'Bucket' => $bucketName,
                'Key'    => $key,
            ]);

            \Log::info('R2 file deleted successfully', ['key' => $key]);
            return true;

        } catch (\Exception $e) {
            \Log::error('R2 Delete Error: ' . $e->getMessage(), ['url' => $fileUrl]);
            // Ne pas lever l'exception - la suppression en DB est plus importante que la suppression en R2
            return false;
        }
    }
}
